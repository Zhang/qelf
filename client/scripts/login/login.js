
'use strict';

(function() {
  var module = angular.module('login', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.login, {
      url: '/login',
      templateUrl: 'scripts/login/login.html',
      controller: 'Login',
      cache: false
    });
  });

  module.controller('Login', function($scope, $state, SessionAPI, STATE, FBService, AccountAPI) {
    $scope.isSignup = false;
    function login(response) {
      SessionAPI.login(response.userID, response.accessToken).then(function resolve() {
        $state.go(STATE.voting);
      }, function reject() {
        alert('failure');
      });
    }

    $scope.fbLogin = function() {
      FBService.getLoginStatus().then(login, function() {
        FBService.login().then(login, function reject(err) {
          alert(err);
        });
      });
    };

    function signup() {
      FBService.login().then(function resolve(res) {
        AccountAPI.create(res.userID, res.accessToken).then(function resolve() {
          $state.go(STATE.voting);
        }, function reject() {
          alert('failure');
        });
      }, function reject(res) { alert('failure', res); });
    }

    $scope.signup = function() {
      FBService.getLoginStatus().then(function loggedIn() {
        FBService.logout().then(signup);
      }, signup);
    };

    $scope.toSignup = function() {
      $scope.isSignup = !$scope.isSignup;
    };
  });
})();
