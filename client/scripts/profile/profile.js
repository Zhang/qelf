'use strict';

(function() {
  var module = angular.module('profile', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.profile, {
      url: '/profile/:current',
      templateUrl: 'scripts/profile/profile.html',
      controller: 'Profile',
      cache: false
    });
  });

  module.controller('Profile', function($scope, StroopResults, $state, STATE, $stateParams, ExperimentsAPI, $rootScope, Modals, Spinner) {
    function getResults() {
      ExperimentsAPI.getResults($scope.experiment.id).then(function(res) {
        $scope.results = res.data;
        $scope.key = _.get($scope.results, 'outcomeKeys[0]');
        sortResultsBy($scope.key);
        Spinner.close();
      });
    }

    function sortResultsBy(key) {
      $scope.results.outcomes = _.sortBy($scope.results.outcomes, function(outcome) {
        return -outcome.score[key.value];
      });
    }

    $scope.sortBy = function() {
      Modals.open(Modals.TYPES.generic, {
        title: 'Sort By',
        items: _.map($scope.results.outcomeKeys, function(outcome) {
          return {
            title: outcome.text,
            action: function(e, item) {
              $scope.key = _.find($scope.results.outcomeKeys, {text: item.title});
              sortResultsBy($scope.key);
            }
          };
        })
      });
    };

    ExperimentsAPI.getForUser($rootScope.user.id).then(function(res) {
      var experiments = _.filter(res.data, 'active');
      $scope.experiments = experiments;
      $scope.experiment = _.find($scope.experiments, {id: $stateParams.current}) || $scope.experiments[0];
      $stateParams.current = $scope.experiment.id;
      getResults();
    });

    $scope.measure = function() {
      $state.go(STATE.trackers, {id: $scope.experiment.id});
    };

    $scope.viewExperiment = function(e) {
      Spinner.open();
      $scope.experiment = _.find($scope.experiments, {id: e.id});
      getResults();
    };
    $scope.nextExperiment = function(direction) {
      var currentIndex = _.indexOf($scope.experiments, $scope.experiment);
      if (currentIndex === 0 && direction === 'right') {
        $scope.viewExperiment($scope.experiments[$scope.experiments.length - 1]);
      } else if (currentIndex === $scope.experiments.length - 1 && direction === 'left') {
        $scope.viewExperiment($scope.experiments[0]);
      } else {
        $scope.viewExperiment($scope.experiments[direction === 'left' ? currentIndex + 1 : currentIndex - 1]);
      }
    };
  });
})();
