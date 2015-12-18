'use strict';

/*
  The frame comprises of consistent components across all views like the navbar
  The frame is responsible for defining consistent containing CSS structure for all underlying views
*/

(function() {
  var module = angular.module('frame', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.frame, {
      url: '',
      templateUrl: 'scripts/frame.html',
      abstract: true,
      cache: false,
      controller: 'Frame',
      resolve: {
        CurrentUser: function(AccountAPI, $rootScope, $state) {
          return AccountAPI.getCurrentUser().then(function resolve(res) {
            $rootScope.user = res.data;
          }, function reject() {
            $state.go(STATE.login);
          });
        }
      }
    });
  });

  module.controller('Frame', function($scope, $rootScope, $state, STATE) {
    $scope.goTo = function(state) {
      if (STATE[state]) {
        $state.go(STATE[state]);
      } else {
        console.log('invalid state: ', state);
      }
    };
  });
})();
