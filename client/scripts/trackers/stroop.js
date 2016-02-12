'use strict';

(function() {
  var module = angular.module('stroop', []);

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

    var stroopBeginTime = null;
    var completedStroops = [];
    $scope.stroops = _.map(_.range(0, 1), function() {
      return {
        color: _.sample(colors),
        text: _.sample(colors),
        reactionTime: 0,
        correct: null
      };
    });

    $timeout(function() {
      $scope.started = true;
      stroopBeginTime = new Date();
      $scope.currentStroop = $scope.stroops.shift();
    }, DELAY_BETWEEN_TRIALS);

    $scope.submit = function(color) {
      $scope.reactionSpeed = new Date() - stroopBeginTime;
      completedStroops.push(_.merge($scope.currentStroop, {
        reactionTime: $scope.reactionSpeed,
        correct: color === $scope.currentStroop.color
      }));
      $scope.showTime = true;
      $timeout(function() {
        stroopBeginTime = new Date();
        $scope.showTime = false;
        $scope.currentStroop = $scope.stroops.shift();
        if (!$scope.currentStroop) {
          var congruentStroops = _.filter(completedStroops, function(cs) {
            return cs.color === cs.text;
          });
          var incongruentStroops = _.filter(completedStroops, function(cs) {
            return cs.color !== cs.text;
          });
          $scope.stroopResults = {
            total: completedStroops.length,
            correct: _.filter(completedStroops, 'correct').length,
            reactionTime: Math.floor(_.sum(completedStroops, 'reactionTime') / completedStroops.length),
            avgCongruentReactionTime: Math.floor(_.sum(congruentStroops, 'reactionTime') / congruentStroops.length),
            avgIncongruentReactionTime: Math.floor(_.sum(incongruentStroops, 'reactionTime') / incongruentStroops.length)
          };
          StroopResults.add($scope.stroopResults);
          $scope.onComplete({
            results: $scope.stroopResults
          });
        }
      }, DELAY_BETWEEN_TRIALS);
    };
  });
  module.directive('stroop', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&'
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/stroop.html',
      controller: 'Stroop'
    };
  });
})();
