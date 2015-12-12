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
    $scope.feedbacks = [{
      contestants: [
        { img: 'assets/tdown.png',
          name: 'Please don\'t contact me about this feedback'
        },
        {
          img: 'assets/tup.png',
          name: 'Feel free to contact me about this feedback'
        }
      ],
      trait: {
        title: 'Sheen App Feedback'
      }
    }];

    $scope.swipe = function(feedback, canContact) {
      console.log(arguments)
;      if (feedback) {
        FeedbackAPI.create(feedback, canContact).then(function() {
          console.log('something');
        }, function() {
          console.log('something');
        });
      }
    };
  });
})();
