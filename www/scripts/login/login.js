'use strict';

(function() {
  var module = angular.module('login', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.login, {
      url: '/login',
      templateUrl: 'scripts/login/login.html',
      controller: 'Login'
    });
  });

  module.controller('Login', function($scope, $state, SessionAPI, STATE) {
    $scope.login = function(email, password) {
      SessionAPI.login(email, password).then(function resolve() {
        alert('logged in');
      }, function reject() {
        alert('failure');
      });
    };
    $scope.toSignup = function() {
      $state.go(STATE.signup);
    };
  });
})();
