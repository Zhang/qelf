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
      }
    };
  });

  module.service('AccountAPI', function(HttpHelper) {
    return {
      create: function(email, password) {
        return HttpHelper.post('user', { email: email, password: password });
      },
      get: function(id) {
        return HttpHelper.get('user/' + encodeURIComponent(id));
      },
      getCurrentUser: function() {
        return HttpHelper.get('user/current');
      },
      updateExperiments: function(userId, templateIds) {
        return HttpHelper.post('user/experiments/' + userId, {templateIds: templateIds});
      }
    };
  });

  module.service('SessionAPI', function(HttpHelper) {
    return {
      login: function(email, password) {
        return HttpHelper.post('login', { email: email, password: password });
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
  module.service('ExperimentTemplatesAPI', function(HttpHelper) {
    return {
      get: function() {
        return HttpHelper.get('experimentTemplate/');
      }
    };
  });

  module.service('ExperimentsAPI', function(HttpHelper) {
    return {
      getExperiment: function(id) {
        return HttpHelper.get('experiment/' + encodeURIComponent(id));
      },
      submit: function(id, res) {
        return HttpHelper.post('experiment/submit/' + encodeURIComponent(id), res);
      },
      getForUser: function(userId) {
        return HttpHelper.get('experiment/user/' + encodeURIComponent(userId));
      },
      getResults: function(id) {
        return HttpHelper.get('experiment/results/' + encodeURIComponent(id));
      }
    };
  });
})();
