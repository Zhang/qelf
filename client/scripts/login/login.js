'use strict';

(function() {
  var module = angular.module('login', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.login, {
      url: '/',
      templateUrl: 'scripts/login/login.html',
      controller: 'Login',
      cache: false,
      resolve: {
        authResponse: function(FBService) {
          return FBService.getLoginStatus();
        }
      }
    });
  });

  module.controller('Login', function($scope, $state, SessionAPI, STATE, FBService, authResponse) {
    if (authResponse.userId) {
      login(authResponse);
    }

    function login(response) {
      SessionAPI.login(response.userID).then(function resolve() {
        $state.go(STATE.voting);
      }, function reject() {
        alert('failure');
      });
    }

    $scope.fbLogin = function() {
      FBService.login().then(login, function reject(err) {
        alert(err);
      });
    };

    $scope.toSignup = function() {
      $state.go(STATE.signup);
    };
  });
})();
