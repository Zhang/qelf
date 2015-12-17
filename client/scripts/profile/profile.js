'use strict';

/*
  Profile comprises of your profile
*/

(function() {
  var module = angular.module('profile', ['gridster']);

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

    $scope.gridsterOpts = {
        columns: 3, // the width of the grid, in columns
        floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [3, 3], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        mobileBreakPoint: 0, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minRows: 2, // the minimum height of the grid, in rows
        defaultSizeX: 1, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        resizable: {
           enabled: false
        },
        draggable: {
           enabled: false
        }
    };
    $scope.mainTrait = { sizeX: 2, sizeY: 2, row: 0, col: 0 };
    $scope.categoryPicker = { sizeX: 2, sizeY: 1, row: 2, col: 0 };
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
          return $scope.trait.total <= 4 ? 'Not Enough Votes' : Math.ceil(($scope.trait.count/$scope.trait.total) * 100) + '%';
        })();
      }
    };
  });
})();
