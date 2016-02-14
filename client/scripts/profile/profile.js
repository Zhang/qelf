'use strict';

(function() {
  var module = angular.module('profile', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.profile, {
      url: '/profile/:current',
      templateUrl: 'scripts/profile/profile.html',
      controller: 'Profile'
    });
  });

  module.controller('Profile', function($scope, StroopResults, $state, STATE, $stateParams, ExperimentsAPI, $rootScope, Modals) {
    function getResults() {
      ExperimentsAPI.getResults($scope.experiment.id).then(function(res) {
        $scope.results = res.data;
        $scope.key = _.get($scope.results, 'outcomeKeys[0]');
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
            }
          };
        })
      });
    };
    ExperimentsAPI.getForUser($rootScope.user.id).then(function(res) {
      var experiments = _.filter(res.data, 'active');
      $scope.experiments = experiments;
      $scope.experiment = _.find($scope.experiments, {id: $stateParams.current}) || $scope.experiments[0];
      getResults();
    });

    $scope.measure = function() {
      $state.go(STATE.trackers, {id: $scope.experiment.id});
    };


    $scope.viewExperiment = function(e) {
      $scope.experiment = _.find($scope.experiments, {id: e.id});
      getResults();
    };

  });
})();
