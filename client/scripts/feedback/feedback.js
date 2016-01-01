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

  module.controller('Feedback', function($scope, FeedbackAPI) {
    $scope.submit = function() {
      if ($scope.feedbackText) {
        FeedbackAPI.create($scope.feedbackText).then(function() {
          $scope.feedbackText = '';
        }, function() {
          console.log('something');
        });
      }
    };
  });
})();
