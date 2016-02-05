'use strict';

(function() {
  var module = angular.module('tracking', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.tracking, {
      url: '/tracking',
      templateUrl: 'scripts/mocks2/tracking.html',
      controller: 'Tracking'
    });
  });

  module.controller('Tracking', function($scope, StroopResults) {
    $scope.overall = {
      accuracy: StroopResults.getAverageAccuracy(),
      reactionTime: StroopResults.getAverageReactionTime()
    };
    $scope.variables = [{
      text: 'Time since last received text',
      score: 0.7
    }, {
      text: 'Currently Multitasking',
      score: 0.5
    }, {
      text: 'Mood',
      score: 0.65
    }, {
      text: 'Hours slept',
      score: 0.3
    }];
  });
})();
