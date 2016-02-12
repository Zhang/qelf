'use strict';

(function() {
  var module = angular.module('profile', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.profile, {
      url: '/profile/:current',
      templateUrl: 'scripts/profile/profile.html',
      controller: 'Profile',
      resolve: {
        Experiments: function(ExperimentsAPI) {
          return ExperimentsAPI.get();
        }
      }
    });
  });

  module.controller('Profile', function($scope, StroopResults, $state, STATE, $stateParams, Experiments) {
    $scope.measure = function() {
      $state.go(STATE.trackers, {id: $scope.experiment.id});
    };

    $scope.experiments = Experiments;
    $scope.experiment = _.find($scope.experiments, {id: $stateParams.current}) || $scope.experiments[0];

    $scope.viewExperiment = function(e) {
      $scope.experiment = _.find($scope.experiments, {id: e.id});
    };

    $scope.variables = $scope.experiment.ranking.getScores($scope.experiment.results);
  });
})();
