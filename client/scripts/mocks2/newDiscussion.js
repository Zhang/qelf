'use strict';

(function() {
  var module = angular.module('discussions', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.discussions, {
      url: '/discussions',
      templateUrl: 'scripts/mocks2/discussions.html',
      controller: 'Discussions'
    });
  });

  module.controller('Discussions', function($scope) {
    $scope.routines = [{
      stars: 14,
      title: 'Habits that brought me from an average student to a 4.0 student last semester',
      author: 'CornNutz'
    },
    {
      stars: 11,
      title: '9 Rules I Learned About Getting Old',
      author: 'OldManGreg'
    },
    {
      stars: 9,
      title: 'PeaceH\'s Guide to Becoming Disciplined',
      author: 'PeaceH'
    },
    {
      stars: 4,
      title: 'First Steps, How to Wake Up Early, How to Study for School and Getting Rid of Internet Addiction',
      author: 'Caesarofthesky',
    }];
  });
})();
