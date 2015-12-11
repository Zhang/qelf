'use strict';

(function() {
  var app = angular.module('landingPage', ['vote.managers.account']);
  app.config(function($stateProvider) {
    $stateProvider

    .state('landingPage', {
      url: '/',
      templateUrl: 'scripts/landingPage/landingPage.html',
      controller: 'LandingController'
    });
  });

  app.controller('LandingController', function($scope, $state, AccountManager, $ionicPopup, STATE) {
    $scope.login = function(email, password) {
      AccountManager.login(email, password).then(function resolve() {
        $state.go('app.connections');
      }, function reject() {
        $ionicPopup.alert({
          title: 'Login Failed',
          template: 'Failed login, please make sure your credentials are correct and try again'
        });
      });
    };
    $scope.goToSignup = function() {
      $state.go(STATE.signup);
    };
  });
})();
