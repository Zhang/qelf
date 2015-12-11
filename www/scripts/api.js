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
      create: function(username, password) {
        return HttpHelper.post('account', { username: username, password: password });
      },
      get: function(id) {
        return HttpHelper.get('account/' + encodeURIComponent(id));
      }
    };
  });

  module.service('SessionAPI', function(HttpHelper) {
    return {
      login: function(username, password) {
        return HttpHelper.post('login', { username: username, password: password });
      },
      logout: function() {
        return HttpHelper.post('logout');
      }
    };
  });
})();
