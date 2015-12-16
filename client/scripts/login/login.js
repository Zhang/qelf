
'use strict';

(function() {
  var module = angular.module('login', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.login, {
      url: '/',
      templateUrl: 'scripts/login/login.html',
      controller: 'Login',
      cache: false
    });
  });

  module.controller('Login', function($scope, $state, SessionAPI, STATE, FBService, AccountAPI) {
    $scope.isSignup = false;
    function login(response) {
      SessionAPI.login(response.accessToken).then(function resolve() {
        $state.go(STATE.voting);
      }, function reject() {
        alert('failure');
      });
    }

    $scope.fbLogin = function() {
      FBService.getLoginStatus().then(login, function() {
        SessionAPI.login().then(function resolve() {
          FBService.login().then(login, function reject(err) {
            alert(err);
          });
        });
      });
    };

    $scope.signup = function() {
      FBService.login().then(function resolve(res) {
        AccountAPI.create(res.userID, res.accessToken).then(function resolve() {
          $state.go(STATE.voting);
        }, function reject() {
          alert('failure');
        });
      }, function reject(err) {
        alert(err);
      });
    };

    $scope.toSignup = function() {
      $scope.isSignup = !$scope.isSignup;
    };
  });
})();
