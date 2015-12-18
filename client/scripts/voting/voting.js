'use strict';

/*
  Voting comprises of voting logic
*/

(function() {
  var module = angular.module('voting', ['card']);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.voting, {
      url: '/voting',
      templateUrl: 'scripts/voting/voting.html',
      controller: 'Voting'
    });
  });

  module.service('CardManager', function() {
    return function(cards) {
      this.display = cards.splice(0, 3);
      this.fullList = cards;
      this.swipe = function swipe() {
        if (!_.isEmpty(this.fullList)) {
          this.display.push(this.fullList.shift());
        }
      };
    };
  });

  module.controller('Voting', function($scope, CardManager, $rootScope, VoteAPI) {
    VoteAPI.getForUser($rootScope.user.facebookId).then(function(res) {
      if (_.isEmpty(res.data)) {
        $scope.emptyVotes = true;
      } else {
        $scope.cardManager = new CardManager(res.data);
      }
    });

    $scope.swipe = function(voteId, selected) {
      $scope.cardManager.swipe();
      VoteAPI.submit(voteId, selected.facebookId);
    };
  });
})();
