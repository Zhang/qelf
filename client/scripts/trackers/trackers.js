'use strict';

(function() {
  var module = angular.module('trackers', [
    'stroop',
    'count',
    'instruction',
    'time',
    'multiple'
  ]);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.trackers, {
      url: '/trackers/:id',
      templateUrl: 'scripts/trackers/trackers.html',
      controller: 'Trackers',
      resolve: {
        Experiment: function(ExperimentsAPI, $stateParams) {
          return ExperimentsAPI.getExperiment($stateParams.id).then(function(res) {
            return res.data;
          });
        }
      }
    });
  });

  module.service('CurrentResults', function() {
    return function() {
      var results = {
        measured: {},
        outcome: {}
      };

      this.addMeasure = function(res) {
        results.measured = {
          value: res.value,
          type: res.type
        };
      };
      this.addOutcome = function(res) {
        results.outcome = {
          value: res.value,
          type: res.type
        };
      };
      this.setTime = function() {
        results.time = new Date();
      };
      this.clear = function() {
        results = [];
      };
      this.get = function() {
        return results;
      };
    };
  });

  module.controller('Trackers', function($scope, $state, STATE, Experiment, $stateParams, ExperimentsAPI, CurrentResults) {
    var resultManager = new CurrentResults();
    var trackers = _.clone(Experiment.template.procedure);
    $scope.current = trackers.shift();

    $scope.next = function(res) {
      var result = {
        value: res,
        type: $scope.current.type
      };

      if ($scope.current.measured) {
        resultManager.addMeasure(result);
      } else if ($scope.current.outcome) {
        resultManager.addOutcome(result);
      }

      $scope.current = trackers.shift();
      if(!$scope.current) {
        resultManager.setTime();
        ExperimentsAPI.submit(Experiment.id, resultManager.get());
        $state.go(STATE.profile, {current: $stateParams.id});
      }
    };
  });
})();
