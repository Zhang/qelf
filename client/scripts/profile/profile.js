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
    });

    $('#profile-picture').css('background-image', 'url(' + $rootScope.user.profilePicture + ')');
  });

  module.directive('traitCard', function() {
    return {
      scope: {
        trait: '='
      },
      templateUrl: 'scripts/profile/traitCard.html',
      link: function($scope) {
        $scope.score = (function getValidScore() {
          return $scope.trait.total.length <= 4 ? 'Not Enough Votes' : Math.ceil(($scope.trait.count/$scope.trait.total) * 100) + '%';
        })();
      }
    };
  });
})();
