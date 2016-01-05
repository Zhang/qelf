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
          alert('Thanks for the feedback, an email has been directly sent to the team!');
        }, function() {
          alert('Something went wrong with sending your feedback. Feel free to email scottzhang235@gmail.com!');
        });
      }
    };
  });
})();
