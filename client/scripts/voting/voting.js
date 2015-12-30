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
      var current = 0;
      this.display = cards.splice(0, 3);
      this.fullList = cards;
      this.next = function next() {
        if (!_.isEmpty(this.fullList)) {
          this.display.push(this.fullList.shift());
        }
        if (this.display[current + 1]) {
          current += 1;
          this.current = this.display[current];
        }
      };
      this.current = this.display[current];
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

    $scope.submit = function(voteId, selected) {
      VoteAPI.submit(voteId, selected.facebookId);
    };

    $scope.vote = function(leftOrRight) {
      $scope.$broadcast('vote:' + leftOrRight, $scope.cardManager.current);
      $scope.cardManager.next();
    };
  });
})();
