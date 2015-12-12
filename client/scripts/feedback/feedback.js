'use strict';

(function() {
  var module = angular.module('feedback', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.feedback, {
      url: '/feedback',
      templateUrl: 'scripts/feedback/feedback.html',
      controller: 'Feedback'
    });
  });

  module.controller('Feedback', function($scope) {
    $scope.contestants = [
      { img: 'assets/tdown.png',
        name: 'Please don\'t contact me about this feedback'
      },
      {
        img: 'assets/tup.png',
        name: 'Feel free to contact me about this feedback'
      }
    ];
    $scope.trait = {
      title: 'Sheen App Feedback'
    };
  });
})();
