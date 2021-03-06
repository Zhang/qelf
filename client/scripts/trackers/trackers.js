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
        Experiment: function(ExperimentsAPI, $stateParams, Spinner) {
          return ExperimentsAPI.getExperiment($stateParams.id).then(function(res) {
            Spinner.close();
            return res.data;
          });
        }
      }
    });
  });

  module.service('CurrentResults', function() {
    return function() {
      var results = [];

      this.addMeasure = function(res, experimentId) {
        results.measured = {
          value: res.value,
          type: res.type,
          time: new Date(),
          experimentId: experimentId
        };
      };
      this.addOutcome = function(res) {
        results.outcome = {
          value: res.value,
          type: res.type
        };
      };
      this.clear = function() {
        results = [];
      },
      this.get = function() {
        return results;
      };
    };
  });

  module.controller('Trackers', function($scope, $state, STATE, Experiment, $stateParams, ExperimentsAPI, CurrentResults, Modals) {
    var resultManager = new CurrentResults();
    var trackers = _.clone(Experiment.template.procedure);
    $scope.current = trackers.shift();

    $scope.next = function(res) {
      var result = {
        value: res,
        type: $scope.current.type
      };
      if ($scope.current.type !== 'instruction') {
        resultManager.addMeasure(result, $scope.current.id);
      }

      $scope.current = trackers.shift();
      if(!$scope.current) {
        ExperimentsAPI.submit(Experiment.id, resultManager.get());
        Modals.open(Modals.TYPES.alert, {
          title: 'Measurement Complete',
          top: '45%',
          onClose: function() {
            $state.go(STATE.profile, {current: $stateParams.id});
          }
        });
      }

      $scope.$on('$stateChangeSuccess', function() {
        resultManager.clear();
      })
    };
  });
})();
