'use strict';

(function() {
  var module = angular.module('multiple', []);

  module.controller('Multiple', function($scope) {
    $scope.submit = function(selection) {
      $scope.onComplete({results: selection});
    };
  });

  module.directive('multiple', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&',
        text: '=',
        choices: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/multiple.html',
      controller: 'Multiple'
    };
  });
})();
