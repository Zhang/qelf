'use strict';

(function() {
  var module = angular.module('experiments', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.experiments, {
      url: '/experiments',
      templateUrl: 'scripts/experiments/experiments.html',
      controller: 'Experiments',
      resolve: {
        Experiments: function(ExperimentTemplatesAPI) {
          return ExperimentTemplatesAPI.get().then(function(res) {
            return res.data;
          });
        }
      }
    });
  });

module.controller('Experiments', function($scope, $state, STATE, Experiments, ExperimentsAPI, $rootScope, AccountAPI, Spinner) {
    ExperimentsAPI.getForUser($rootScope.user.id).then(function(res) {
      Spinner.close();
      $scope.selected = _.map(_.filter(res.data, 'active'), 'template');
    });

    $scope.experiments = Experiments;
    $scope.isSelected = function(ex) {
      return !!_.find($scope.selected, { id: ex.id });
    };

    $scope.selectExperiment = function(ex) {
      if (_.remove($scope.selected, {id: ex.id}).length !== 0) return;
      $scope.selected.push(ex);
    };

    $scope.saveSelection = function() {
      if (!$scope.selected.length) return;
      AccountAPI.updateExperiments($rootScope.user.id, _.map($scope.selected, 'id')).then(function() {
        $state.go(STATE.profile);
      });
    };
  });
})();
