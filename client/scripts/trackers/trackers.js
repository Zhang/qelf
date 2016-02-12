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
    var trackers = _.clone(Experiment.trackers);
    $scope.current = trackers.shift();

    $scope.next = function(res) {
      var result = {
        value: res
      };
      result.variant = $scope.current.variant;
      result.id = $scope.current.id;
      CurrentResults.add(result);
      $scope.current = trackers.shift();

      if(!$scope.current) {
        ExperimentsAPI.submit(Experiment.id, CurrentResults.get());
        $state.go(STATE.profile, {current: $stateParams.id});
      }
    };
    $scope.$on('$stateChangeStart', function() {
      CurrentResults.clear();
    });
  });
})();
