'use strict';

/*
  Profile comprises of your profile
*/

(function() {
  var module = angular.module('profile', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.profile, {
      url: '/profile',
      templateUrl: 'scripts/profile/profile.html',
      controller: 'Profile'
    });
  });

  module.controller('Profile', function($scope, TraitAPI, $rootScope, Modals) {
    function sortByTopTraits(traits) {
      return _.sortBy(traits, function(trait) {
        if (_.isEmpty(trait.total)) return 0;
        return -1 * (trait.count / trait.total.length);
      });
    }
    function getHighestScore(traits) {
      var highestScore = 0;
      _.each(traits, function(trait) {
        if (trait.total.length && (trait.count / trait.total.length) > highestScore) {
          highestScore = trait.count / trait.total.length;
        }
      });
      return highestScore;
    }
    TraitAPI.getForUser($rootScope.user.facebookId).then(function(res) {
      $scope.highestScore = getHighestScore(res.data);
      $scope.traits = sortByTopTraits(res.data);
      $scope.topTraits = (function getTopTraits() {
        var orderedTraits = _.sortBy(_.compact(_.map($scope.traits, function(trait) {
          if(trait.total.length === 0) return null;
          trait.score = trait.count / trait.total.length;
          return trait;
        })), 'score', -1);
        return orderedTraits.splice(0, 3);
      })();
      $scope.overviewSentence = (function constructOverviewSentence() {
        if (_.isEmpty($scope.topTraits)) {
          return 'Not enough votes to determine top traits, invite more friends to gather more data!';
        }
        if ($scope.topTraits.length === 1) {
          return 'Your top trait is ' + $scope.topTraits[0].templateId + '! Invite more friends to get results on your remaining traits.';
        }
        if ($scope.topTraits.length > 1) {
          return 'Your top traits are : ' + _.map($scope.topTraits, 'templateId').join(', ') + '!';
        }
      })();
    });

    $scope.sortBy = function() {
      $scope.popupItems = [{
        title: 'Lowest Traits',
        action: function sortByLowTraits() {
          $scope.sortByText = this.title;
          $scope.traits = _.sortBy($scope.traits, function(trait) {
            if (_.isEmpty(trait.total)) return 0;
            return trait.count / trait.total.length;
          });
        }
      }, {
        title: 'Top Traits',
        action: function byTopTraits() {
          $scope.sortByText = this.title;
          $scope.traits = sortByTopTraits($scope.traits);
        }
      }, {
        title: 'Least Voted On',
        action: function sortByLeastVotedOn() {
          $scope.sortByText = this.title;
          $scope.traits = _.sortBy($scope.traits, function(trait) {
            return trait.total.length;
          });
        }
      }, {
        title: 'Most Voted On',
        action: function sortByMostVotedOn() {
          $scope.sortByText = this.title;
          $scope.traits = _.sortBy($scope.traits, function(trait) {
            return (-1 * trait.total.length);
          });
        }
      }];

      $scope.popupTitle = 'Sort Traits By';
      Modals.open($scope);
    };

    $('#profile-picture').css('background-image', 'url(' + $rootScope.user.profilePicture + ')');
  });

  module.directive('traitCard', function($state, STATE) {
    return {
      scope: {
        trait: '=',
        highestScore: '='
      },
      templateUrl: 'scripts/profile/traitCard.html',
      link: function($scope, el) {
        $scope.score = (function getValidScore() {
          return _.size($scope.trait.total) <= 4 ? 'Not Enough Votes' : (Math.ceil(($scope.trait.count/_.size($scope.trait.total)) * 100) / $scope.highestScore) + '%';
        })();
        $(el[0].querySelector('.score-overlay')).css('width', $scope.score || 0);
        $scope.viewTrait = function() {
          $state.go(STATE.trait, {id: $scope.trait.id});
        };
      }
    };
  });
})();
