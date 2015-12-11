'use strict';

(function() {
  var app = angular.module('landingPage', []);
  app.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.landingPage, {
      url: '/',
      templateUrl: 'scripts/landingPage/landingPage.html',
      controller: 'LandingController'
    });
  });

  app.controller('LandingController', function($scope, $state, STATE) {
    $scope.login = function(email, password) {
      // AccountManager.login(email, password).then(function resolve() {
      //   $state.go('app.connections');
      // }, function reject() {
      //   $ionicPopup.alert({
      //     title: 'Login Failed',
      //     template: 'Failed login, please make sure your credentials are correct and try again'
      //   });
      // });
    };
    $scope.goToSignup = function() {
      $state.go(STATE.signup);
    };
  });
})();
