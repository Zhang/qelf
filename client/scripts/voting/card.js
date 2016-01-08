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

        this.onTransitionOut(dir);

        var transitionDir = 0.35;
        ionic.requestAnimationFrame(function() {
          transformUtils.translateAndRotate(self.el, dir * 450, 0, dir);
          self.el.style.transition = self.el.style.webkitTransition = 'all ' + transitionDir + 's ease-in-out';
        });

        // Trigger destroy after card has swiped out
        setTimeout(function() {
          self.onDestroy && self.onDestroy();
        }, transitionDir * 1000);
      }
    });
  });

  module.directive('card', function($timeout, SwipeableCard, transformUtils) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/voting/card.html',
      transclude: true,
      replace: true,
      scope: {
        vote: '=',
        comment: '=',
        onSubmit: '&'
      },
      compile: function() {
        return function($scope, $element) {
          var el = $element[0];
          // Force hardware acceleration for animation - better performance on first touch
          transformUtils.translateDefault(el);
          var swipeableCard = new SwipeableCard({
            el: el,
            onTransitionOut: function(amt) {
              $timeout(function() {
                var isLeftVote = amt < 0;
                $scope.onSubmit({
                  selected: isLeftVote ? $scope.vote.contestants[0] : $scope.vote.contestants[1]
                });
              });
            },
            onDestroy: function() {
              $timeout(function() {
                el.remove();
              });
            }
          });
          $scope.$parent.swipeCard = swipeableCard;

          function voteSubmit(dir) {
            return function(e, vote) {
              if (vote.id !== $scope.vote.id) return;
              swipeableCard.transitionOut(dir);
            };
          }
          $scope.onComment = function() {
            $scope.$emit('card:commenting');
          };

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
