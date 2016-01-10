'use strict';

/*
  Voting comprises of voting logic
*/

(function() {
  var module = angular.module('card', ['transformUtils']);

  module.factory('SwipeableCard', function(transformUtils) {
    return ionic.views.View.inherit({
      initialize: function(opts) {
        opts = ionic.extend({}, opts);
        ionic.extend(this, opts);

        this.el = opts.el;
      },
      transitionOut: function(dir) {
        var self = this;

        var transitionDir = 0.35;
        ionic.requestAnimationFrame(function() {
          transformUtils.translateAndRotate(self.el, dir * 450, 0, dir);
          transformUtils.transitionTime(self.el, transitionDir);
        });

        // Trigger destroy after card has swiped out
        setTimeout(function() {
          self.onDestroy && self.onDestroy();
        }, transitionDir * 1000);
      }
    });
  });

  module.directive('card', function($timeout, SwipeableCard, transformUtils, $rootScope, VoteAPI, Mixpanel) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/voting/card.html',
      transclude: true,
      replace: true,
      scope: {
        vote: '='
      },
      compile: function() {
        return function($scope, $element) {
          var el = $element[0];
          // Force hardware acceleration for animation - better performance on first touch
          transformUtils.translateDefault(el);
          var swipeableCard = new SwipeableCard({
            el: el,
            onDestroy: function() {
              $timeout(function() {
                el.remove();
              });
            }
          });
          $scope.$parent.swipeCard = swipeableCard;

          function voteSubmit(dir) {
            return function(e, vote, score) {
              if (vote.id !== $scope.vote.id) return;
              Mixpanel.track('Voted', {
                userId: $rootScope.user.id,
              });
              var selected = dir === -1 ? $scope.vote.contestants[0] : $scope.vote.contestants[1];
              VoteAPI.submit(vote.id, selected.facebookId, score);
              swipeableCard.transitionOut(dir);
            };
          }

          $scope.$on('vote:left', voteSubmit(-1));
          $scope.$on('vote:right', voteSubmit(1));
        };
      }
    };
  });

  module.directive('contestant', function() {
    return {
      restrict: 'E',
      templateUrl: 'scripts/voting/contestant.html',
      transclude: true,
      scope: {
        contestant: '='
      },
      link: function($scope, el) {
        var candidateImgContainer = $(el).find('.contestant-picture')[0];
        $(candidateImgContainer).css('background-image', 'url(' + $scope.contestant.profilePicture + ')');
      }
    };
  });
})();
