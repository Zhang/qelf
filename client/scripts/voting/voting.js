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
      top: null
    }

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
        var self = this;
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

  module.controller('Voting', function($scope, CardDeckManager, $window) {
    CardDeckManager.getCardsIfEmpty();
    $scope.cardDeck = CardDeckManager.deck;

    $scope.vote = function(result, score) {
      $scope.$broadcast('vote:' + result, $scope.cardDeck.top, score);
      CardDeckManager.getNextCard();
    };

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
        submit: '&'
      },
      link: function($scope, el) {
        $scope.certainty = {
          text: ''
        };
        var STROKE_WIDTH = 8;
        var circle = $(el).find('#circle');
        circle.attr('stroke-width', STROKE_WIDTH);
        var BASE_OFFSET = 440;
        var FULL_OFFSET = 220;
        circle.css('stroke-dashoffset', BASE_OFFSET);
        var drawCircle = function(amt) {
          if (amt < 0.33) {
            $scope.certainty.text = 'agree';
          } else if (amt < 0.66) {
            $scope.certainty.text = 'Definitely';
          } else {
            $scope.certainty.text = 'ABSOLUTELY!!';
          }
          $scope.$digest();
          circle.css('stroke-dashoffset', (BASE_OFFSET - amt * FULL_OFFSET));
        };

        var Slider = ionic.views.View.inherit({
          initialize: function(opts) {
            opts = ionic.extend({}, opts);
            ionic.extend(this, opts);

            this.el = opts.el;
            this.parentWidth = this.el.parentNode.offsetWidth;
            this.width = this.el.offsetWidth;
            circle.attr('r', (this.width - STROKE_WIDTH) / 2 - 1);

            this.startX = (this.parentWidth / 2) - (this.width / 2);
            this.startY = 0;

            this.threshold = (this.parentWidth / 2);
            this.voteThreshold = (this.parentWidth / 2) + (this.width / 2);

            this.bindEvents();
            transformUtils.translate3d(this.el, this.startX, this.startY);
          },
          _doDrag: function(e) {
            e.preventDefault();
            if (e.gesture.deltaX >= 0) {
              if ((e.gesture.deltaX + this.startX) > this.threshold) {
                this.x = this.startX + this.threshold + Math.min((e.gesture.deltaX - this.threshold - this.startX) / 1.5, this.voteThreshold - this.threshold);
              } else {
                this.x = this.startX + Math.min(e.gesture.deltaX, this.voteThreshold);
              }
            } else {
              if (e.gesture.deltaX < -(this.threshold - this.startX)) {
                this.x = this.startX - this.threshold + Math.max((e.gesture.deltaX + this.threshold + this.startX) / 1.5, -(this.voteThreshold - this.threshold));
              } else {
                this.x = this.startX + Math.max(e.gesture.deltaX, -this.voteThreshold);
              }
            }

            if (Math.abs(this.x) >= this.threshold || (this.x - this.startX) <= -this.threshold) {
              drawCircle(Math.min(1, (Math.abs(this.x - this.startX) - this.threshold) / (this.voteThreshold - this.threshold)));
            } else {
              circle.css('stroke-dashoffset', BASE_OFFSET);
              if ($scope.certainty.text) {
                $scope.certainty.text = '';
                $scope.$digest();
              }
            }

            transformUtils.translate3d(this.el, this.x, this.startY);
          },
          _doDragEnd: function(e) {
            $scope.certainty.text = '';
            if (Math.abs(e.gesture.deltaX) > this.threshold) {
              $scope.submit({
                result: this.x > this.startX ? 'right' : 'left',
                score: ((BASE_OFFSET - parseInt(circle.css('stroke-dashoffset'), 10)) / FULL_OFFSET)
              });
            }

            this.snapBack();
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
          snapBack: function() {
            var self = this;
            var TRANSITION_TIME = 0.15;
            circle.css('stroke-dashoffset', BASE_OFFSET);
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
