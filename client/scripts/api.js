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
      create: function(facebookId) {
        return HttpHelper.post('account', { facebookId: facebookId });
      },
      get: function(id) {
        return HttpHelper.get('account/' + encodeURIComponent(id));
      },
      getCurrentUser: function() {
        return HttpHelper.get('account/current');
      }
    };
  });

  module.service('SessionAPI', function(HttpHelper) {
    return {
      login: function(facebookId) {
        return HttpHelper.post('login', { facebookId: facebookId });
      },
      logout: function() {
        return HttpHelper.post('logout');
      }
    };
  });

  module.service('FeedbackAPI', function(HttpHelper) {
    return {
      create: function(feedbackText, canContact) {
        return HttpHelper.post('feedback', { canContact: canContact, feedbackText: feedbackText });
      }
    };
  });

  module.service('TraitAPI', function(HttpHelper) {
    return {
      getForUser: function(facebookId) {
        return HttpHelper.get('trait/query/' + facebookId);
      }
    };
  });
})();
