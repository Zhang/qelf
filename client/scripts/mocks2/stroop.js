'use strict';

(function() {
  var module = angular.module('stroop', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.stroop, {
      url: '/stroop',
      templateUrl: 'scripts/mocks2/stroop.html',
      controller: 'Stroop'
    });
  });
  module.service('StroopResults', function() {
    var results = [];
    return {
      getAverageReactionTime: function() {
        return Math.floor(_.sum(results, 'reactionTime') / results.length);
      },
      getAverageAccuracy: function() {
        return Math.floor(_.sum(results, 'correct') / _.sum(results, 'total') * 100);
      },
      add: function(result) {
        results.push(result);
      },
      temp: results
    };
  });
  module.controller('Stroop', function($scope, $timeout, StroopResults) {
    var colors = ['Red', 'Purple'];
    var DELAY_BETWEEN_TRIALS = 500;
    $scope.started = false;
    var stroopBegin = null;

    $scope.start = function() {
      $scope.started = true;
      $scope.completedStroops = [];
      $scope.stroops = _.map(_.range(0, 15), function() {
        return {
          color: _.sample(colors),
          text: _.sample(colors),
          reactionTime: 0,
          correct: null
        };
      });
      $timeout(function() {
        stroopBegin = new Date();
        $scope.currentStroop = $scope.stroops.shift();
      }, DELAY_BETWEEN_TRIALS);
    };

    $scope.submit = function(color) {
      var stroopEnd = new Date();
      $scope.reactionSpeed = stroopEnd - stroopBegin;
      $scope.completedStroops.push(_.merge($scope.currentStroop, {
        reactionTime: $scope.reactionSpeed,
        correct: color === $scope.currentStroop.color
      }));
      $scope.showTime = true;
      $timeout(function() {
        stroopBegin = new Date();
        $scope.showTime = false;
        $scope.currentStroop = $scope.stroops.shift();
        if (!$scope.currentStroop) {
          $scope.started = false;
          $scope.stroopResults = {
            total: $scope.completedStroops.length,
            correct: _.filter($scope.completedStroops, 'correct').length,
            reactionTime: Math.floor(_.sum($scope.completedStroops, 'reactionTime') / $scope.completedStroops.length)
          };
          StroopResults.add($scope.stroopResults);
        }
      }, DELAY_BETWEEN_TRIALS);
    };
  });
})();
