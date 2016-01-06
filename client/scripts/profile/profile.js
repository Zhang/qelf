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

  //Used to calculate the score in profile and trait views;
  module.service('TopScore', function() {
    return {
      set: function(score) {
        this.score = score;
      },
      score: null
    };
  });

  module.controller('Profile', function($scope, TraitAPI, $rootScope, Modals, Mixpanel, TopScore) {
    Mixpanel.track('Viewed Profile', {id: $rootScope.user.id});
    function sortByTopTraits(traits) {
      return _.sortBy(traits, function(trait) {
        if (trait.total.length <= 3) return 0;
        return -1 * trait.score;
      });
    }

    TraitAPI.getForUser($rootScope.user.facebookId).then(function(res) {
      var traitsWithScores = (function addDefaultPropsToTraits() {
        return _.map(res.data, function(trait) {
          trait.score = trait.total.length ? (trait.count / trait.total.length) : 0;
          trait.display = true;
          return trait;
        });
      })();

      TopScore.set(_.max(traitsWithScores, 'score').score);

      $scope.traits = sortByTopTraits(traitsWithScores);
      var topTraits = (function getTopTraits() {
        var orderedTraits = _.sortBy($scope.traits, 'score', -1);
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
          return 'Your top traits are: ' + _.map(topTraits, 'templateId').join(', ') + ', and ' + lastEl.templateId + '!';
        }
      })();
    });

    $scope.sortBy = function() {
      var opts = {
        items: [
          {
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
                if (trait.total.length <= 3) return 0;
                return trait.score;
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
          }
        ],
        title: 'Sort Traits'
      };
      Modals.open(null, opts);
    };

    $scope.viewByCategory = function() {
      var opts = {};
      var ALL_TRAITS = 'All Traits';
      var UNIQUE_CATEGORIES = _.compact(_.uniq(_.flatten(_.map($scope.traits, 'categories'))));
      UNIQUE_CATEGORIES.unshift(ALL_TRAITS)
      opts.items = _.map(UNIQUE_CATEGORIES, function(category) {
        return {
          title: category,
          action: function() {
            $scope.viewCategory = category;
            _.each($scope.traits, function(trait) {
              if (_.contains(trait.categories, category) || category === ALL_TRAITS) {
                trait.display = true;
              } else {
                trait.display = false;
              }
            });
          }
        };
      });
      opts.title = 'View By Category';
      Modals.open(null, opts);
    };

    $('#profile-picture').css('background-image', 'url(' + $rootScope.user.profilePicture + ')');
  });

  module.directive('traitCard', function($state, STATE, TopScore) {
    return {
      scope: {
        trait: '='
      },
      templateUrl: 'scripts/profile/traitCard.html',
      link: function($scope, el) {
        $scope.score = (function getValidScore() {
          return _.size($scope.trait.total) <= 3 ? 'Not Enough Votes' : Math.floor((($scope.trait.count/_.size($scope.trait.total)) * 100) / TopScore.score) + '%';
        })();
        $(el[0].querySelector('.score-overlay')).css('width', $scope.score || 0);
        //set the right sided borders to round when the overlay is nearly full
        if (_.contains(['100%', '99%'], $scope.score)) {
          $(el[0].querySelector('.score-overlay')).css('border-bottom-right-radius', '3px');
          $(el[0].querySelector('.score-overlay')).css('border-top-right-radius', '3px');
        }

        $scope.viewTrait = function() {
          $state.go(STATE.trait, {id: $scope.trait.id});
        };
      }
    };
  });
})();
