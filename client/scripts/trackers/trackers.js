'use strict';

(function() {
  var module = angular.module('trackers', [
    'stroop',
    'count'
  ]);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.trackers, {
      url: '/trackers',
      templateUrl: 'scripts/trackers/trackers.html',
      controller: 'Trackers'
    });
  });
  module.controller('Trackers', function($scope, $state, STATE) {
    var trackers = [{
      text: 'stroop'
    }, {
      text: 'count'
    }];
    $scope.current = trackers.shift();

    $scope.next = function() {
      $scope.current = trackers.shift();

      //submitting final results logic
      if(!$scope.current) {
        $state.go(STATE.profile);
      }
    };
  });
})();
