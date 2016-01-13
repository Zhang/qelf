'use strict';

(function() {
  var module = angular.module('walkthrough', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.walkthrough, {
      url: '/walkthrough',
      templateUrl: 'scripts/walkthrough/walkthrough.html',
      controller: 'Walkthrough',
      resolve: {
        CurrentUser: function(AccountAPI) {
          return AccountAPI.getCurrentUser().then(function resolve(res) {
            return res.data;
          });
        }
      }
    });
  });

  module.controller('Walkthrough', function(AccountAPI, $rootScope, $state, STATE, $scope, CurrentUser) {
    $scope.complete = function() {
      AccountAPI.setViewed(CurrentUser.id, 'walkthrough').then(function resolve() {
        $state.go(STATE.voting);
      }, function reject(err) {
        console.log(err);
        alert('Error completing walkthrough');
      });
    };
  });
})();
