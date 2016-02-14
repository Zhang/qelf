'use strict';

(function() {
  var module = angular.module('instruction', []);

  module.controller('Instruction', function($scope) {
    $scope.submit = function() {
      $scope.onComplete({results: $scope.presetValue});
    };
  });
  module.directive('instruction', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&',
        text: '=',
        presetValue: '=?'
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/instruction.html',
      controller: 'Instruction'
    };
  });
})();
