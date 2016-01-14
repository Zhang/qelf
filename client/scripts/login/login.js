
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

  module.controller('Login', function($scope, $state, SessionAPI, STATE, FBService, AccountAPI, Modals) {
    function failedToLoginToFacebook() {
      Modals.open(Modals.TYPES.alert, {
        text: 'Looks like something went wrong with the facebook login',
        title: 'Failed to login to Facebook'
      });
    }

    $scope.isSignup = false;
    function login(response) {
      SessionAPI.login(response.userID, response.accessToken).then(function resolve() {
        $state.go(STATE.voting);
      }, function reject() {
        Modals.open(Modals.TYPES.alert, {
          text: 'Failed to login, please ensure you\'ve signed up before trying to log in',
          title: 'Login Error'
        });
      });
    }

    $scope.fbLogin = function() {
      FBService.getLoginStatus().then(login, function() {
        FBService.login().then(login, function reject(err) {
          console.error(err);
          failedToLoginToFacebook();
        });
      });
    };

    function signup() {
      FBService.login().then(function resolve(res) {
        AccountAPI.create(res.userID, res.accessToken).then(function resolve() {
          $state.go(STATE.voting);
        }, function reject(err) {
          if (err.data === 'attempting to add duplicate user') {
            Modals.open(Modals.TYPES.alert, {
              text: 'An account associated with this facebook account already exists',
              title: 'Duplicate Account'
            });
          } else {
            Modals.open(Modals.TYPES.alert, {
              text: 'Looks like something went wrong with creating this account. Contact scottzhang235@gmail.com if this problem persists.',
              title: 'Failed to create account'
            });
          }
        });
      }, function reject(res) {
        failedToLoginToFacebook();
      });
    }

    $scope.signup = signup;

    $scope.toSignup = function() {
      $scope.isSignup = !$scope.isSignup;
    };
  });
})();
