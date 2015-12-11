'use strict';

(function() {
  var app = angular.module('signup', []);
  app.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.signup, {
      url: '/signup',
      templateUrl: 'scripts/landingPage/signup.html',
      controller: 'signupController'
    });
  });

  app.controller('signupController', function($scope, AccountAPI) {
    $scope.signup = function(email, password) {
      AccountAPI.create(email, password).then(function resolve() {
        alert('You did it!!');
      }, function reject() {
        alert('You failed to do it!');
        // $ionicPopup.alert({
        //   title: 'Invalid Email',
        //   template: 'Seems like someone is already using that email address, and you cannot claim it'
        // });
      });
    };
  });
})();
