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

  module.controller('Feedback', function($scope, FeedbackAPI, Modals) {
    $scope.submit = function() {
      if ($scope.feedbackText) {
        //Ask for their email
        Modals.open(Modals.TYPES.email, {
          onClose: function(modalScope) {
            FeedbackAPI.create($scope.feedbackText, modalScope.email).then(function() {
              $scope.feedbackText = '';
              alert('Thanks for the feedback, an email has been directly sent to the team!');
            }, function() {
              alert('Something went wrong with sending your feedback. Feel free to email scottzhang235@gmail.com!');
            });
          }
        });
      } else {
        alert('Sorry, I don\'t understand what you\'re trying to say. It may help to write something');
      }
    };
  });
})();
