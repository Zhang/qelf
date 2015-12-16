'use strict';

(function() {
  var module = angular.module('signup', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.signup, {
      url: '/signup',
      templateUrl: 'scripts/login/signup.html',
      controller: 'Signup',
      cache: false
    });
  });

  module.controller('Signup', function($scope, AccountAPI, $state, STATE, FBService) {
    $scope.signup = function() {
      FBService.login().then(function resolve(res) {
        AccountAPI.create(res.userID).then(function resolve() {
          $state.go(STATE.voting);
        }, function reject() {
          alert('failure');
        });
      }, function reject(err) {
        alert(err);
      });
    };
    $scope.toLogin = function() {
      $state.go(STATE.login);
    };
  });
})();
