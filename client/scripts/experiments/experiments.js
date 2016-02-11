'use strict';

(function() {
  var module = angular.module('experiments', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.experiments, {
      url: '/experiments',
      templateUrl: 'scripts/experiments/experiments.html',
      controller: 'Experiments'
    });
  });

  module.controller('Experiments', function($scope, $state, STATE) {
    $scope.selected = [];
    $scope.experiments = [{
      title: 'Habits that brought me from an average student to a 4.0 student last semester',
    },
    {
      title: '9 Rules I Learned About Getting Old',
    },
    {
      title: 'PeaceH\'s Guide to Becoming Disciplined',
    },
    {
      title: 'First Steps, How to Wake Up Early, How to Study for School and Getting Rid of Internet Addiction',
    }];
    $scope.selectExperiment = function(ex) {
      ex.selected = !ex.selected;
      if (_.remove($scope.selected, {title: ex.title}).length !== 0) return;
      $scope.selected.push(ex);
    };
    $scope.saveSelection = function() {
      if (!$scope.selected.length) return;
      $state.go(STATE.profile);
    };
  });
})();
