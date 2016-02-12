'use strict';

(function() {
  var module = angular.module('instruction', []);

  module.controller('Instruction', function() {});
  module.directive('instruction', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&',
        instructions: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/instruction.html',
      controller: 'Instruction'
    };
  });
})();
