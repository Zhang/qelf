'use strict';

(function() {
  var module = angular.module('rating', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.rating, {
      url: '/rating',
      templateUrl: 'scripts/mocks2/rating.html',
      controller: 'Rating'
    });
  });
  //Caches ratings prior to submission
  module.service('CurrentRatings', function() {
    var ratings = {};
    return {
      set: function(key, rating) {
        ratings[key] = rating;
      },
      get: function(key) {
        return ratings[key];
      }
    };
  });
  module.controller('Rating', function($scope, CurrentRatings, $timeout, STATE, $state) {
    var current = 0;
    function setScores() {
      function getIcon(value, rating) {
          return rating >= value ? 'icon-star-filled' : 'icon-star';
      }
      if ($scope.scores) {
        _.each($scope.scores, function(score) {
          score.icon = getIcon(score.value, CurrentRatings.get($scope.metric.text));
        });
      } else {
        $scope.scores = _.map(_.range(1, 6), function(value) {
          return {
            value: value,
            icon: getIcon(value, CurrentRatings.get($scope.metric.text))
          };
        });
      }
    }

    $scope.metrics = [{
      question: 'How would you rate your energy levels today?',
      text: 'Energy',
      rated: '1-5',
      ratesPerDay: 10000
    },
    {
      question: 'How would you rate your sleep today?',
      text: 'Sleep',
      rated: '1-5',
      ratesPerDay: 1
    },
    {
      question: 'How would you rate your nutrition today?',
      text: 'Diet',
      rated: '1-5',
      ratesPerDay: 10000
    },
    ];

    $scope.metric = $scope.metrics[current];

    if ($scope.metric.rated === '1-5') {
      setScores();
    }
    $scope.rate = function(score) {
      CurrentRatings.set($scope.metric.text, score);
      setScores();
      $timeout(function() {
        if (current === $scope.metrics.length - 1) {
          $scope.submit = true;
        } else {
          $scope.metric = $scope.metrics[++current];
          setScores();
        }
      }, 500);
    };
    $scope.submitRatings = function() {
      $state.go(STATE.tracking);
    };
    $scope.backToRating = function() {
      $scope.submit = false;
      current = 0;
      $scope.metric = $scope.metrics[current];
      setScores();
    };
  });
})();
