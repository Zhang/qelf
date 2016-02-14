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

  module.controller('Profile', function($scope, StroopResults, $state, STATE, $stateParams, ExperimentsAPI, $rootScope) {
    function getResults() {
      ExperimentsAPI.getResults($scope.experiment.id).then(function(res) {
        $scope.results = res.data;
      });
    }

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
