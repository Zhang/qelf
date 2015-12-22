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

  module.controller('Profile', function($scope, TraitAPI, $rootScope) {
    TraitAPI.getForUser($rootScope.user.facebookId).then(function(res) {
      $scope.traits = res.data;
      $scope.topTraits = (function getTopTraits() {
        var orderedTraits = _.sortBy(_.compact(_.map($scope.traits, function(trait) {
          if(trait.total.length === 0) return null;
          trait.score = trait.count / trait.total.length;
          return trait;
        })), 'score', -1);
        return orderedTraits.splice(0, 3);
      })();
      $scope.overviewSentence = (function getOverviewSentence() {
        if (_.isEmpty($scope.topTraits)) {
          return 'Not enough votes to determine top traits, invite more friends to gather more data!';
        }
        if ($scope.topTraits.length === 1) {
          return 'Your top trait is ' + $scope.topTraits[0].templateId + '! Invite more friends to get results on your remaining traits.';
        }
        if ($scope.topTraits.length > 1) {
          return 'Your top traits are ' + _.map($scope.topTraits, 'templateId').join(', ') + '!';
        }
      })();
    });

    $('#profile-picture').css('background-image', 'url(' + $rootScope.user.profilePicture + ')');
  });

  module.directive('traitCard', function($state, STATE) {
    return {
      scope: {
        trait: '='
      },
      templateUrl: 'scripts/profile/traitCard.html',
      link: function($scope) {
        $scope.score = (function getValidScore() {
          return $scope.trait.total.length <= 4 ? 'Not Enough Votes' : Math.ceil(($scope.trait.count/$scope.trait.total) * 100) + '%';
        })();

        $scope.viewTrait = function() {
          $state.go(STATE.trait, {id: $scope.trait.id});
        };
      }
    };
  });
})();
