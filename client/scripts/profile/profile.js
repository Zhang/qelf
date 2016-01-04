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
    function displayAllTraits(traits) {
      return _.map(traits, function(trait) {
        return _.assign(trait, {display: true});
      });
    }

    TraitAPI.getForUser($rootScope.user.facebookId).then(function(res) {
      $scope.highestScore = getHighestScore(res.data);
      $scope.traits = displayAllTraits(sortByTopTraits(res.data));
      var topTraits = (function getTopTraits() {
        var orderedTraits = _.sortBy(_.compact(_.map($scope.traits, function(trait) {
          if (_.isEmpty(trait.total)) return null;
          trait.score = trait.count / trait.total.length;
          return trait;
        })), 'score', -1);
        return orderedTraits.splice(0, 3);
      })();
      $scope.overviewSentence = (function constructOverviewSentence() {
        if (_.isEmpty(topTraits)) {
          return 'Not enough votes to determine top traits, invite more friends to gather more data!';
        }
        if (topTraits.length === 1) {
          return 'Your top trait is ' + topTraits[0].templateId + '! Invite more friends to get results on your remaining traits.';
        }
        if (topTraits.length > 1) {
          var lastEl = topTraits.splice(topTraits.length - 1)[0];
          return 'Your top traits are that you are: ' + _.map(topTraits, 'templateId').join(', ') + ', and ' + lastEl.templateId + '!';
        }
      })();
    });

    $scope.sortBy = function() {
      $scope.popupItems = [{
        title: 'Top Traits',
        action: function byTopTraits() {
          $scope.sortByText = this.title;
          $scope.traits = sortByTopTraits($scope.traits);
        }
      }, {
        title: 'Lowest Traits',
        action: function sortByLowTraits() {
          $scope.sortByText = this.title;
          $scope.traits = _.sortBy($scope.traits, function(trait) {
            if (_.isEmpty(trait.total)) return 0;
            return trait.count / trait.total.length;
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
      }, {
        title: 'Least Voted On',
        action: function sortByLeastVotedOn() {
          $scope.sortByText = this.title;
          $scope.traits = _.sortBy($scope.traits, function(trait) {
            return trait.total.length;
          });
        }
      }];
      $scope.popupTitle = 'Sort Traits';
      Modals.open($scope);
    };

    $scope.viewByCategory = function() {
      var ALL_CATEGORIES = 'All Categories';
      var UNIQUE_CATEGORIES = _.compact(_.uniq(_.flatten(_.map($scope.traits, 'categories'))));
      UNIQUE_CATEGORIES.unshift(ALL_CATEGORIES)
      $scope.popupItems = _.map(UNIQUE_CATEGORIES, function(category) {
        return {
          title: category,
          action: function() {
            $scope.viewCategory = category;
            _.each($scope.traits, function(trait) {
              if (_.contains(trait.categories, category) || category === ALL_CATEGORIES) {
                trait.display = true;
              } else {
                trait.display = false;
              }
            });
          }
        };
      });
      $scope.popupTitle = 'View By Category';
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
          return _.size($scope.trait.total) <= 4 ? 'Not Enough Votes' : Math.floor((($scope.trait.count/_.size($scope.trait.total)) * 100) / $scope.highestScore) + '%';
        })();
        $(el[0].querySelector('.score-overlay')).css('width', $scope.score || 0);
        $scope.viewTrait = function() {
          $state.go(STATE.trait, {id: $scope.trait.id});
        };
      }
    };
  });
})();
