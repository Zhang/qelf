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

  module.service('CardManager', function($timeout) {
    return function(cards, onComplete) {
      var current = 0;
      var totalCards = cards.length;
      this.display = cards.splice(0, 3);
      this.fullList = cards;
      this.isEmpty = cards.length === 0;
      this.current = this.display[current];
      this.next = function next() {
        //Allow for the card-animation to complete before turning to empty state
        if (current ===  (totalCards - 1)) {
          return $timeout(function() {
            if (onComplete) {
              onComplete();
            }
          }, 200);
        }

        if (!_.isEmpty(this.fullList)) {
          this.display.push(this.fullList.shift());
        }
        if (this.display[current + 1]) {
          current += 1;
          this.current = this.display[current];
        }
      };
    };
  });

  module.controller('Voting', function($scope, CardManager, $rootScope, VoteAPI, $timeout, OverlayService, Mixpanel) {
    function getVotes() {
      VoteAPI.getForUser($rootScope.user.facebookId).then(function(res) {
        $scope.cardManager = new CardManager(res.data, getVotes);
      });
    }
    getVotes();

    $scope.submit = function(voteId, selected) {
      Mixpanel.track('Voted', {
        userId: $rootScope.user.id,
      });
      VoteAPI.submit(voteId, selected.facebookId);
    };

    $scope.vote = function(leftOrRight) {
      $scope.$broadcast('vote:' + leftOrRight, $scope.cardManager.current);
      $scope.cardManager.next();
    };

    $scope.share = function() {
      window.plugins.socialsharing.share('Invite some people to aggregate self', 'You\'re invitied');
    };
  });
})();
