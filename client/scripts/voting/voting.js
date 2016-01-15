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

  module.service('CardDeckManager', function($timeout, VoteAPI, $rootScope) {
    var deck = {
      display: [],
      fullDeck: [],
      top: null,
      isEmpty: null
    };

    function _getCards() {
      VoteAPI.getForUser($rootScope.user.facebookId).then(function(res) {
        initialize(res.data);
      });
    }

    function initialize(cards) {
      deck.display = cards.splice(0, 3);
      deck.fullDeck = cards;
      deck.top = _.first(deck.display);
      deck.isEmpty = _.isEmpty(deck.display);
    }

    function isOutOfCards() {
      return _.isEmpty(deck.fullList) && _.isEmpty(deck.display);
    }

    return {
      getNextCard: function() {
        if (!_.isEmpty(deck.fullDeck)) {
          deck.display.push(deck.fullDeck.shift());
        }

        //Allow for the card-animation to complete before turning to empty state
        $timeout(function() {
          deck.display.shift();
          deck.top = _.first(deck.display);
          if (isOutOfCards()) {
            _getCards();
          }
        }, 350);
      },
      deck: deck,
      getCardsIfEmpty: function() {
        if (isOutOfCards()) {
          _getCards();
        }
      }
    };
  });

  module.controller('Voting', function($scope, CardDeckManager, $window, AccountAPI, $rootScope) {
    CardDeckManager.getCardsIfEmpty();
    $scope.cardDeck = CardDeckManager.deck;

    var leftOverlay;
    var rightOverlay;

    $scope.onRelease = function() {
      if (leftOverlay && rightOverlay) {
        rightOverlay.fadeOut(300);
        leftOverlay.fadeOut(300);
      }
    };

    var digestDebounced = _.debounce(function() {
      $scope.$digest();
    }, 10);
    $scope.onDrag = function(direction, score) {
      if (!leftOverlay || !rightOverlay) {
        leftOverlay = $('.card').find('.contestant-overlay.left').first();
        rightOverlay = $('.card').find('.contestant-overlay.right').first();
      }

      var selectedOverlay = direction === 'left' ? leftOverlay : rightOverlay;
      var notSelectedOverlay = direction === 'left' ? rightOverlay : leftOverlay;
      notSelectedOverlay.fadeOut(100);

      if (score) {
        $scope.cardDeck.top.displayScore = Math.ceil(score * 100);
        digestDebounced();
        selectedOverlay.fadeIn(200);
      } else {
        selectedOverlay.fadeOut(100);
      }
    };

    $scope.vote = function(result) {
      leftOverlay = null;
      rightOverlay = null;

      if (!$rootScope.user.viewed.dragText) {
        $rootScope.user.viewed.dragText = true;
        AccountAPI.setViewed($rootScope.user.id, 'dragText');
      }

      $scope.$broadcast('vote:' + result, $scope.cardDeck.top, $scope.cardDeck.top.displayScore);
      CardDeckManager.getNextCard();
    };
    // (function autovoteall() {
    //   setInterval(function() {
    //     $scope.cardDeck.top.displayScore = Math.ceil(Math.random() * 100);
    //     $scope.vote('left');
    //   }, 400);
    // })();
    $scope.share = function() {
      $window.plugins.socialsharing.share('Invite some people to aggregate self', 'You\'re invitied');
    };
  });

  module.directive('voteSlider', function(transformUtils, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'scripts/voting/voteSlider.html',
      replace: true,
      scope: {
        submit: '&',
        dragFn: '&',
        onRelease: '&'
      },
      link: function($scope, el) {
        var Slider = ionic.views.View.inherit({
          initialize: function(opts) {
            opts = ionic.extend({}, opts);
            ionic.extend(this, opts);

            this.el = opts.el;
            this.parentWidth = this.el.parentNode.offsetWidth;
            this.width = this.el.offsetWidth;

            this.startX = (this.parentWidth / 2) - (this.width / 2);
            this.startY = 0;

            this.threshold = (this.parentWidth / 3);
            this.voteThreshold = (this.parentWidth / 2) + (this.width / 2);

            this.bindEvents();
            transformUtils.translate3d(this.el, this.startX, this.startY);
          },
          _doDrag: function(e) {
            e.preventDefault();
            //Responsible for maintaining x distance
            //increasing friction of pull when determining % confidence
            if (e.gesture.deltaX >= 0) {
              if ((e.gesture.deltaX) > this.threshold) {
                this.x = this.startX + this.threshold + Math.min((e.gesture.deltaX - this.threshold) / 2, this.voteThreshold - this.threshold);
              } else {
                this.x = this.startX + Math.min(e.gesture.deltaX, this.voteThreshold);
              }
            } else {
              if (e.gesture.deltaX < -this.threshold) {
                this.x = this.startX - this.threshold + Math.max((e.gesture.deltaX + this.threshold) / 2, -(this.voteThreshold - this.threshold));
              } else {
                this.x = this.startX + Math.max(e.gesture.deltaX, -this.voteThreshold);
              }
            }

            var score = Math.abs(e.gesture.deltaX) > this.threshold ? Math.min(1, (Math.abs(this.x - this.startX) - this.threshold) / (this.voteThreshold - this.threshold)) : 0;
            var leftOrRight = e.gesture.deltaX > 0 ? 'right' : 'left';
            $scope.dragFn({
              direction: leftOrRight,
              score: score
            });

            transformUtils.translate3d(this.el, this.x, this.startY);
          },
          _doDragEnd: function(e) {
            $scope.onRelease();
            if (Math.abs(e.gesture.deltaX) > this.threshold) {
              $scope.submit({
                result: this.x > this.startX ? 'right' : 'left'
              });
            }

            this.snapBack(0.35);
          },
          bindEvents: function() {
            var self = this;

            ionic.onGesture('drag', function(e) {
              ionic.requestAnimationFrame(function() { self._doDrag(e); });
              e.gesture.srcEvent.preventDefault();
            }, self.el);

            ionic.onGesture('dragend', function(e) {
              ionic.requestAnimationFrame(function() { self._doDragEnd(e); });
              e.gesture.srcEvent.preventDefault();
            }, self.el);
          },
          snapBack: function(transitionSpeed) {
            var self = this;
            var TRANSITION_TIME = transitionSpeed || 0.15;

            ionic.requestAnimationFrame(function() {
              transformUtils.translate3d(self.el, self.startX, self.startY);
              transformUtils.transitionTime(self.el, TRANSITION_TIME);
              $timeout(function() {
                transformUtils.resetTransitionTime(self.el);
              }, TRANSITION_TIME * 1000);
            });
          }
        });
        var elem = $(el).find('#drag-vote')[0];
        transformUtils.translateDefault(elem);
        new Slider({
          el: elem
        });
      }
    };
  });
})();
