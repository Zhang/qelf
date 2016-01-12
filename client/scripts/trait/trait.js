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

  module.controller('Trait', function(ViewedTrait, $scope, $rootScope, Modals, TopScore) {
    $scope.trait = ViewedTrait;
    var totalVotes = _.map(ViewedTrait.total, function(vote) {
      vote.sentiment = vote.selected === $rootScope.user.facebookId;
      return vote;
    });
    function enoughVotes() {
      return _.size($scope.trait.total) > 3;
    }
    $scope.score = (function getValidScore() {
      return enoughVotes() ? Math.floor((($scope.trait.count/_.size($scope.trait.total)) * 100) / TopScore.score) + '%' : 'Not Enough Votes';
    })();
    $scope.confidence = enoughVotes() ? Math.ceil(_.sum($scope.trait.total, 'score') / _.size($scope.trait.total)) : null;
    $scope.enoughVotes = enoughVotes();

    $scope.voteWithComments = _.filter(totalVotes , function(vote) {
      return !!vote.comment;
    });

    $scope.showHelp = function(type) {
      var opts = {};
      if (type === 'score') {
        opts.text = 'Scores are weighted against your most positively-voted trait, rather than an absolute percentage of people who vote for you / total';
        opts.title = 'Score calculation';
      }
      if (type === 'confidence') {
        opts.text = 'Confidence ratings are calculated through the degree to which people vote';
        opts.title = 'Confidence Rating';
      }

      Modals.open(null, opts);
    };
  });
})();
