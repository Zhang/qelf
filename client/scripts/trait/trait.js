'use strict';

/*
  Trait view is a deep dive of an individual trait by user
*/

(function() {
  var module = angular.module('trait', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.trait, {
      url: '/trait/:id',
      templateUrl: 'scripts/trait/trait.html',
      controller: 'Trait',
      resolve: {
        ViewedTrait: function(TraitAPI, $stateParams, $state) {
          return TraitAPI.getTrait($stateParams.id).then(function resolve(res) {
            return res.data;
          }, function reject(err) {
            console.log(err);
            $state.go(STATE.profile);
          });
        }
      }
    });
  });

  module.controller('Trait', function(ViewedTrait, $scope, $rootScope, Modals) {
    $scope.trait = ViewedTrait;
    var totalVotes = _.map(ViewedTrait.total, function(vote) {
      vote.sentiment = vote.selected === $rootScope.user.facebookId;
      return vote;
    });

    $scope.voteWithComments = _.filter(totalVotes , function(vote) {
      return !!vote.comment;
    });

    $scope.enoughVotes = $scope.trait.total.length >= 4;
    $scope.showHelp = function() {
      $scope.popupText = 'Scores are relative to your most popular trait, and are calculated by the formula: score = (current-trait-% / top-trait-%)';
      $scope.popupTitle = 'Score calculation';
      Modals.open($scope);
    };
  });
})();
