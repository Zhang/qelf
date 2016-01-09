'use strict';

(function() {
  var module = angular.module('api', []);
  module.service('HttpHelper', function($http, ENV) {
    return {
      post: function(url, json) {
        return $http.post(ENV.apiEndpoint + url, json);
      },
      get: function(url) {
        return $http.get(ENV.apiEndpoint + url);
      },
    };
  });

  module.service('AccountAPI', function(HttpHelper) {
    return {
      create: function(facebookId, access_token) {
        return HttpHelper.post('account', { facebookId: facebookId, access_token: access_token });
      },
      get: function(id) {
        return HttpHelper.get('account/' + encodeURIComponent(id));
      },
      getCurrentUser: function() {
        return HttpHelper.get('account/current');
      },
      completeWalkthrough: function(id) {
        return HttpHelper.post('account/_walkthrough', { id: id });
      },
    };
  });

  module.service('SessionAPI', function(HttpHelper) {
    return {
      login: function(facebookId, access_token) {
        return HttpHelper.post('login', { facebookId: facebookId, access_token: access_token });
      },
      logout: function() {
        return HttpHelper.post('logout');
      }
    };
  });

  module.service('FeedbackAPI', function(HttpHelper, $rootScope) {
    return {
      create: function(feedbackText, email) {
        return HttpHelper.post('feedback', { email: email, facebookId: $rootScope.user.facebookId, feedbackText: feedbackText });
      }
    };
  });

  module.service('TraitAPI', function(HttpHelper) {
    return {
      getForUser: function(facebookId) {
        return HttpHelper.get('trait/query/' + facebookId);
      },
      getTrait: function(id) {
        return HttpHelper.get('trait/' + id);
      }
    };
  });

  module.service('VoteAPI', function(HttpHelper) {
    return {
      getForUser: function(facebookId) {
        return HttpHelper.get('vote/' + facebookId);
      },
      submit: function(voteId, selectedFbId, score) {
        return HttpHelper.post('vote/' + voteId, { selected: selectedFbId, score: score });
      }
    };
  });
})();
