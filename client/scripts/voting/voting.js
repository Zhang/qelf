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
        $scope.cardManager = new CardManager([{
          contestants: [{
            profilePicture: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=aeb1719bca94d2ece69224915b758902&oe=570B31FB',
            name: 'Lucy in the sky'
          }, {
            profilePicture: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=aeb1719bca94d2ece69224915b758902&oe=570B31FB',
            name: 'Lucy in the sky'
          }],
          comparison: 'This is the person you are more likely to watch a public performance by',
          trait: 'sdf',
          id: '1'
        },
        {
          contestants: [{}, {}],
          comparison: 'adsfasdf',
          trait: 'sdf',
          id: '2'
        },
        {
          contestants: [{}, {}],
          comparison: 'adsfasdf',
          trait: 'sdf',
          id: '3'
        }]);
      } else {
        $scope.cardManager = new CardManager(res.data);
      }
      // if (_.isEmpty(res.data)) {
      //   $scope.emptyVotes = true;
      // } else {
      // }
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
