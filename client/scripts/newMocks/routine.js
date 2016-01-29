'use strict';

//CURRENTLY UNUSED
(function() {
  var module = angular.module('routine', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.routine, {
      url: '/routine',
      templateUrl: 'scripts/newMocks/routine.html',
      controller: 'Routine'
    });
  });

  module.controller('Routine', function($scope) {
    $scope.discussions = [{
      upvotes: 10,
      title: 'What are some of the things you guys do to practice self acceptance?'
    },
    {
      upvotes: 6,
      title: 'This is another discussion topic'
    },
    {
      upvotes: 4,
      title: 'This is the last discussion topic'
    }];
    $scope.habits = ['Practice Self Acceptance', 'Exercise', 'Eat Healthy', 'Reduce Internet Consumption'];
  });
})();
