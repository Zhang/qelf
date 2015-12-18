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
    $scope.trait = {
      title: 'Trustworthiness'
    };
    // var cards = [{
    //   contestants: [
    //   {
    //     name: 'This is scott',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=e0fee8c71ce074b2ba8180193ae610bb&oe=56E3A4FB',
    //     location: 'SF'
    //   },
    //   {
    //     name: 'This is scott with a much longer name nefrufru',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12227222_10207147550300686_4239573437995010557_n.jpg?oh=f69bd8425f56583f72d4f388c3b56690&oe=57226CE3',
    //     location: 'San Francisco, California, also France'
    //   }]
    // },
    // {
    //   contestants: [
    //   {
    //     name: 'This is scott',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=e0fee8c71ce074b2ba8180193ae610bb&oe=56E3A4FB',
    //     location: 'SF'
    //   },
    //   {
    //     name: 'This is scott with a much longer name nefrufru',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12227222_10207147550300686_4239573437995010557_n.jpg?oh=f69bd8425f56583f72d4f388c3b56690&oe=57226CE3',
    //     location: 'San Francisco, California, also France'
    //   }]
    // },
    // {
    //   contestants: [
    //   {
    //     name: 'This is scott',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=e0fee8c71ce074b2ba8180193ae610bb&oe=56E3A4FB',
    //     location: 'SF'
    //   },
    //   {
    //     name: 'This is scott with a much longer name nefrufru',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12227222_10207147550300686_4239573437995010557_n.jpg?oh=f69bd8425f56583f72d4f388c3b56690&oe=57226CE3',
    //     location: 'San Francisco, California, also France'
    //   }]
    // },
    // {
    //   contestants: [
    //   {
    //     name: 'This is scott',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12108274_10101564644192315_7334749882900604967_n.jpg?oh=e0fee8c71ce074b2ba8180193ae610bb&oe=56E3A4FB',
    //     location: 'SF'
    //   },
    //   {
    //     name: 'This is scott with a much longer name nefrufru',
    //     img: 'https://scontent-sjc2-1.xx.fbcdn.net/hphotos-xpt1/v/t1.0-9/12227222_10207147550300686_4239573437995010557_n.jpg?oh=f69bd8425f56583f72d4f388c3b56690&oe=57226CE3',
    //     location: 'San Francisco, California, also France'
    //   }]
    // }];
    $scope.swipe = function(dir) {
      $scope.cardManager.swipe();
      console.log(dir);
    };
  });
})();
