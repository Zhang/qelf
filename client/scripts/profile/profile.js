'use strict';

(function() {
  var module = angular.module('profile', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.profile, {
      url: '/profile',
      templateUrl: 'scripts/profile/profile.html',
      controller: 'Profile'
    });
  });

  module.controller('Profile', function($scope, StroopResults, $state, STATE) {
    $scope.measure = function() {
      $state.go(STATE.trackers);
    };
    $scope.experiments = [{
      text: 'What is the best music for me to work to?',
      dataPoints: 4,
      minimumDatapoints: 10,
      ranking: {
        text: 'Best Music To Work With',
        sort: function(variable) {
          return variable.score;
        }
      }
    }, {
      text: 'When guinea pigs ruled',
      dataPoints: 0,
      minimumDatapoints: 0
    }];
    $scope.experiment = $scope.experiments[0];

    $scope.overall = {
      accuracy: StroopResults.getAverageAccuracy(),
      reactionTime: StroopResults.getAverageReactionTime()
    };
    $scope.variables = [{
      text: 'Rap',
      score: 0.7
    }, {
      text: 'Electronic',
      score: 0.5
    }, {
      text: 'Classical',
      score: 0.65
    }, {
      text: 'Rock',
      score: 0.3
    }];
  });
})();
