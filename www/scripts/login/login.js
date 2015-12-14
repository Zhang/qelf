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

  module.controller('Login', function($scope, $state, SessionAPI, STATE) {
    $scope.login = function(email, password) {
      SessionAPI.login(email, password).then(function resolve() {
        $state.go(STATE.voting);
      }, function reject() {
        alert('failure');
      });
    };
    $scope.toSignup = function() {
      $state.go(STATE.signup);
    };
  });
})();
