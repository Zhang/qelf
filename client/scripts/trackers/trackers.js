'use strict';

(function() {
  var module = angular.module('trackers', [
    'stroop',
    'count',
    'instruction',
    'time'
  ]);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.trackers, {
      url: '/trackers/:id',
      templateUrl: 'scripts/trackers/trackers.html',
      controller: 'Trackers',
      resolve: {
        Experiment: function(ExperimentsAPI, $stateParams) {
          return ExperimentsAPI.getExperiment($stateParams.id);
        }
      }
    });
  });

  module.service('CurrentResults', function() {
    var results = [];
    return {
      add: function(res) {
        results.push(res);
      },
      clear: function() {
        results = [];
      },
      get: function() {
        return results;
      }
    };
  });

  module.controller('Trackers', function($scope, $state, STATE, Experiment, $stateParams, ExperimentsAPI, CurrentResults) {
    var trackers = Experiment.trackers;
    $scope.current = trackers.shift();

    $scope.next = function(res) {
      CurrentResults.add(res);
      $scope.current = trackers.shift();

      if(!$scope.current) {
        ExperimentsAPI.submit(Experiment.id, CurrentResults.get());
        $state.go(STATE.profile, {current: $stateParams.id});
      }
    };
    $scope.$on('$stateChangeStart', function() {
      console.log(CurrentResults.clear());
    });
  });
})();
