'use strict';

(function() {
  var module = angular.module('time', []);

  module.controller('Time', function($scope) {
    $scope.submit = function() {
      $scope.onComplete({results: $scope.time});
    };
  });
  module.directive('time', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&',
        timeOf: '=',
        label: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/time.html',
      controller: 'Time'
    };
  });
})();
