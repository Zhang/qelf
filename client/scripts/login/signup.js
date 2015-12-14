'use strict';

(function() {
  var module = angular.module('signup', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.signup, {
      url: '/signup',
      templateUrl: 'scripts/login/signup.html',
      controller: 'Signup'
    });
  });

  module.controller('Signup', function($scope, AccountAPI) {
    $scope.signup = function(email, password) {
      AccountAPI.create(email, password).then(function resolve() {
        alert('You did it!!');
      }, function reject() {
        alert('You failed to do it!');
      });
    };
  });
})();
