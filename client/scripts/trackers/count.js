'use strict';

(function() {
  var module = angular.module('count', []);

  module.controller('Count', function($scope) {
    $scope.count = 0;
    $scope.submit = function() {
      $scope.onComplete({results: $scope.count});
    };
  });
  module.directive('count', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&',
        text: '=',
        label: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/count.html',
      controller: 'Count'
    };
  });
})();
