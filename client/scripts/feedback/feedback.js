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
        FeedbackAPI.create($scope.feedbackText, $scope.email || '').then(function() {
          $scope.feedbackText = '';
          Modals.open(Modals.TYPES.alert, {
            title: 'Thanks for the feedback!'
          });
        }, function() {
          Modals.open(Modals.TYPES.alert, {
            text: 'Something went wrong with sending your feedback. Feel free to email scottzhang235@gmail.com!',
            title: 'Oops!'
          });
        });
      } else {
        Modals.open(Modals.TYPES.alert, {
          text: 'Sorry, I don\'t understand what you\'re trying to say. It may help to write something!',
          title: 'Oops!'
        });
      }
    };
  });
})();
