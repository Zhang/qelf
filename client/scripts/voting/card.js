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

        this.parentWidth = this.el.parentNode.offsetWidth;
        this.width = this.el.offsetWidth;

        this.startX = this.startY = this.x = this.y = 0;

        this.bindEvents();
      },
      setX: function(x) {
        transformUtils.translate3d(this.el, x, this.y);
        this.x = x;
        this.startX = x;
      },
      setY: function(y) {
        transformUtils.translate3d(this.el, this.x, y);
        this.y = y;
        this.startY = y;
      },
      setZIndex: function(index) {
        this.el.style.zIndex = index;
      },
      setWidth: function(width) {
        this.el.style.width = width + 'px';
      },
      setHeight: function(height) {
        this.el.style.height = height + 'px';
      },
      setPopInDuration: function(duration) {
        this.cardPopInDuration = duration;
      },
      transitionIn: function(animationClass) {
        var self = this;

        this.el.classList.add(animationClass + '-start');
        this.el.classList.add(animationClass);
        this.el.style.display = 'block';
        setTimeout(function() {
          self.el.classList.remove(animationClass + '-start');
        }, 100);
      },
      /**
       * Disable transitions on the card (for when dragging)
       */
      disableTransition: function(animationClass) {
        this.el.classList.remove(animationClass);
      },

      /**
       * Swipe a card out programtically
       */
      swipe: function() {
        this.transitionOut();
      },

      /**
       * Snap the card back to its original position
       */
      snapBack: function() {
        this.onSnapBack(this.x, this.y, this.rotationAngle);
      },

      isUnderThreshold: function() {
        //return true;
        return Math.abs(this.thresholdAmount) < .8;
      },
      /**
       * Fly the card out or animate back into resting position.
       */
      transitionOut: function(e) {
        var self = this;

        if(this.isUnderThreshold()) {
          self.onSnapBack(this.x, this.y, this.rotationAngle);
          return;
        }

        self.onTransitionOut(self.thresholdAmount);

        var angle = Math.atan(e.gesture.deltaX / e.gesture.deltaY);

        var dir = this.thresholdAmount < 0 ? -1 : 1;
        var targetX;
        if(this.x > 0) {
          targetX = (this.parentWidth / 2) + (this.width);
        } else {
          targetX = - (this.parentWidth + this.width);
        }

        // Target Y is just the "opposite" side of the triangle of targetX as the adjacent edge (sohcahtoa yo)
        var targetY = targetX / Math.tan(angle);

        // Fly out
        var rotateTo = this.rotationAngle;//(this.rotationAngle this.rotationDirection * 0.2));// || (Math.random() * 0.4);

        var duration = 0.3 - Math.min(Math.max(Math.abs(e.gesture.velocityX)/10, 0.05), 0.2);

        ionic.requestAnimationFrame(function() {
          transformUtils.translateAndRotate(self.el, targetX, targetY, self.rotationAngle);
          self.el.style.transition = self.el.style.webkitTransition = 'all ' + duration + 's ease-in-out';
        });

        //this.onSwipe && this.onSwipe();

        // Trigger destroy after card has swiped out
        setTimeout(function() {
          self.onDestroy && self.onDestroy();
        }, duration * 1000);
      },

      /**
       * Bind drag events on the card.
       */
      bindEvents: function() {
        var self = this;
        ionic.onGesture('dragstart', function(e) {
          /*
          var cx = window.innerWidth / 2;
          if(e.gesture.touches[0].pageX < cx) {
            self._transformOriginRight();
          } else {
            self._transformOriginLeft();
          }
          */
          ionic.requestAnimationFrame(function() { self._doDragStart(e); });
        }, this.el);

        ionic.onGesture('drag', function(e) {
          ionic.requestAnimationFrame(function() { self._doDrag(e); });
          // Indicate we want to stop parents from using this
          e.gesture.srcEvent.preventDefault();
        }, this.el);

        ionic.onGesture('dragend', function(e) {
          ionic.requestAnimationFrame(function() { self._doDragEnd(e); });
        }, this.el);
      },

      // Rotate anchored to the left of the screen
      _transformOriginLeft: function() {
        this.el.style[transformUtils.transformKeys.origin] = 'left center';
        this.rotationDirection = 1;
      },

      _transformOriginRight: function() {
        this.el.style[transformUtils.transformKeys.origin] = 'right center';
        this.rotationDirection = -1;
      },

      _doDragStart: function(e) {
        e.preventDefault();
        var width = this.el.offsetWidth;
        var point = window.innerWidth / 2 + this.rotationDirection * (width / 2);
        var distance = Math.abs(point - e.gesture.touches[0].pageX);// - window.innerWidth/2);

        this.touchDistance = distance * 10;
      },

      _doDrag: function(e) {
        e.preventDefault();

        var o = e.gesture.deltaX / -1000;

        this.rotationAngle = Math.atan(o);

        this.x = this.startX + (e.gesture.deltaX * 0.8);
        this.y = this.startY + (e.gesture.deltaY * 0.8);

        transformUtils.translateAndRotate(this.el, this.x, this.y, this.rotationAngle || 0);

        this.thresholdAmount = (this.x / (this.parentWidth/2));

        var self = this;
        setTimeout(function() {
          self.onPartialSwipe(self.thresholdAmount);
        });
      },
      _doDragEnd: function(e) {
        this.transitionOut(e);
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
        contestants: '=',
        isFeedback: '=',
        trait: '=',
        onRight: '&?',
        onLeft: '&?'
      },
      compile: function() {
        var fadeFn = function(t) {
          // A simple non-linear fade function for the text on each card
          t = Math.min(1, t * 2);

          // This is a simple cubic bezier curve.
          var c4 = 0.11,
              c3 = 0.67,
              c2 = 0.41,
              c1 = 0.99;

          return Math.pow((1 - t), 3) * c1 + 3 * Math.pow((1 -  t), 2) * t * c2 + 3 * (1 - t) * t * t * c3 + Math.pow(t, 3) * c4;
        };

        return function($scope, $element) {
          var el = $element[0];
          $scope.LEFT_CLASS = 'vote-left';
          $scope.RIGHT_CLASS = 'vote-right';
          var leftText = el.querySelector('.' + $scope.LEFT_CLASS);
          var rightText = el.querySelector('.' + $scope.RIGHT_CLASS);
          rightText.style.opacity = 1;
          leftText.style.opacity = 1;

          // Force hardware acceleration for animation - better performance on first touch
          transformUtils.translateDefault(el);

          $scope.feedback = {
            text: ''
          };
          var swipeableCard = new SwipeableCard({
            el: el,
            leftText: leftText,
            rightText: rightText,
            onPartialSwipe: function(amt) {
              var self = this;
              $timeout(function() {
                if (amt < 0) {
                  self.leftText.style.opacity = 1;
                  self.rightText.style.opacity = fadeFn(-amt);
                } else {
                  self.rightText.style.opacity = 1;
                  self.leftText.style.opacity = fadeFn(amt);
                }
                //$scope.onPartialSwipe({amt: amt});
              });
            },
            onTransitionOut: function(amt) {
              $timeout(function() {
                if (amt < 0) {
                  $scope.onRight({
                    feedbackText: $scope.feedback.text,
                    canContact: false
                  });
                } else {
                  $scope.onLeft({
                    feedbackText: $scope.feedback.text,
                    canContact: true
                  });
                }
              });
            },
            onDestroy: function() {
              $timeout(function() {
                el.remove();
              });
            },
            onSnapBack: function(startX, startY, startRotation) {
              var self = this;
              var ANIMATION_TIME = 500;
              collide.animation({
                // 'linear|ease|ease-in|ease-out|ease-in-out|cubic-bezer(x1,y1,x2,y2)',
                // or function(t, duration),
                // or a dynamics configuration (see below)
                duration: ANIMATION_TIME,
                percent: 0,
                reverse: false
              })

              .easing({
                type: 'spring',
                frequency: 15,
                friction: 250,
                initialForce: false
              })

              .on('step', function(v) {
                //Have the element spring over 400px
                transformUtils.translateAndRotate(el, startX - (startX * v), startY - (startY * v), startRotation - (startRotation * v));
              })
              .start();
              $timeout(function() {
                if (self.leftText) self.leftText.style.opacity = 1;
                if (self.rightText) self.rightText.style.opacity = 1;
              }, ANIMATION_TIME / 10);
            }
          });
          $scope.$parent.swipeCard = swipeableCard;
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
        contestant: '=',
        isFeedback: '='
      }
    };
  });
})();
