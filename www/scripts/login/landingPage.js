'use strict';

(function() {
  var app = angular.module('landingPage', []);
  app.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.landingPage, {
      url: '/login',
      templateUrl: 'scripts/landingPage/landingPage.html',
      controller: 'LandingController'
    });
  });

  app.controller('LandingController', function($scope, $state, SessionAPI, STATE) {
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
