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
          // return TraitAPI.getTrait($stateParams.id).then(function resolve(res) {
          //   return res.data;
          // }, function reject(err) {
          //   console.log(err);
          //   $state.go(STATE.profile);
          // });
        }
      }
    });
  });

  module.controller('Trait', function(ViewedTrait, $scope) {
    // $scope.trait = ViewedTrait;
    $scope.trait = {
      templateId: 'scott',
      count: 5,
      total: _.map([{
        comparison: 'is friendly as a wombat\'s soul',
        selected: 1
      },
      {
        comparison: 'has the hair of an angel',
        selected: 2
      },
      {
        comparison: 'likes tacos and isn\'t afraid to admit it',
        selected: 2
      },
      {
        comparison: 'fluffy fluffy bunnies are their favorite thing',
        selected: 1
      }], function(vote) {
        vote.sentiment = vote.selected === 1;
        return vote;
      })
    };

    $scope.enoughVotes = $scope.trait.total.length > 4;
  });
})();
