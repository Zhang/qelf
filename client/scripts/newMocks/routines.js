'use strict';

//CURRENTLY UNUSED
(function() {
  var module = angular.module('routines', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.routines, {
      url: '/routines',
      templateUrl: 'scripts/newMocks/routines.html',
      controller: 'Routines'
    });
  });

  module.controller('Routines', function($scope) {
    $scope.routines = [{
      stars: 14,
      title: 'Habits that brought me from an average student to a 4.0 student last semester',
      author: 'CornNutz',
      habits: 5,
      comments: 8
    },
    {
      stars: 11,
      title: '9 Rules I Learned About Getting Old',
      author: 'OldManGreg',
      habits: 9,
      comments: 12
    },
    {
      stars: 9,
      title: 'PeaceH\'s Guide to Becoming Disciplined',
      author: 'PeaceH',
      habits: 3,
      comments: 4
    },
    {
      stars: 4,
      title: 'First Steps, How to Wake Up Early, How to Study for School and Getting Rid of Internet Addiction',
      author: 'Caesarofthesky',
      habits: 6,
      comments: 1
    }];
  });
})();
