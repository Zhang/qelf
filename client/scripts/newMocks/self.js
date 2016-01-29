'use strict';

(function() {
  var module = angular.module('self', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.self, {
      url: '/self',
      templateUrl: 'scripts/newMocks/self.html',
      controller: 'Self'
    });
  });

  module.controller('Self', function($scope) {
    $scope.habits = [{text: 'Make the bed', percent: 65}, {text: '30 minute jog', percent: 95}, {text: 'Do 5 pomodoros of work', percent: 80}, {text: 'Set a daily intention', percent: 90}];
  });
})();
