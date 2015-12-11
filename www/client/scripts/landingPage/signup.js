'use strict';

(function() {
  var app = angular.module('signup', ['vote.managers.account']);
  app.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.signup, {
      url: '/signup',
      templateUrl: 'scripts/landingPage/signup.html',
      controller: 'signupController'
    });
  });

  app.controller('signupController', function($scope, $state, AccountManager, $ionicPopup, STATE) {
    $scope.signup = function(email, password, screenname) {
      AccountManager.signup(email, password, screenname).then(function resolve() {
        $state.go(STATE.connections);
      }, function reject() {
        $ionicPopup.alert({
          title: 'Invalid Email',
          template: 'Seems like someone is already using that email address, and you cannot claim it'
        });
      });
    };
  });
})();
