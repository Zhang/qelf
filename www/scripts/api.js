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
      create: function(email, password) {
        return HttpHelper.post('account', { email: email, password: password });
      },
      get: function(id) {
        return HttpHelper.get('account/' + encodeURIComponent(id));
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

  module.service('FeedbackAPI', function(HttpHelper) {
    return {
      create: function(feedbackText, canContact) {
        return HttpHelper.post('feedback', { canContact: canContact, feedbackText: feedbackText });
      }
    };
  });
})();
