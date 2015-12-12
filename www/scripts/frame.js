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
      controller: 'Frame'
    });
  });

  module.controller('Frame', function($scope, $state, STATE) {
    $scope.goTo = function(state) {
      if (STATE[state]) {
        $state.go(STATE[state]);
      } else {
        console.log('invalid state: ', state);
      }
    };
  });
})();
