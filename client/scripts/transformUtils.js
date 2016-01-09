'use strict';

/*
  Transform utils
*/

(function() {
  var module = angular.module('transformUtils', []);

  module.factory('transformUtils', function() {
    var d = document.createElement('div');

    var transformKeys = ['webkitTransformOrigin', 'transform-origin', '-webkit-transform-origin', 'webkit-transform-origin',
                '-moz-transform-origin', 'moz-transform-origin', 'MozTransformOrigin', 'mozTransformOrigin'];
    var transitionKeys = ['webkitTransition', 'transition', '-webkit-transition', 'webkit-transition',
                '-moz-transition', 'moz-transition', 'MozTransition', 'mozTransition'];
    var keys = (function getTransformKeys() {
      return {
        origin: _.find(transformKeys, function(key) {
          return !_.isUndefined(d.style[key]);
        }) || 'webkitTransformOrigin',
        transition: _.find(transitionKeys, function(key) {
          return !_.isUndefined(d.style[key]);
        }) || 'webkitTransition'
      };
    })();

    return {
      translateDefault: function(el) {
        el.style.transform = el.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
      },
      translate3d: function translate3d(el, x, y) {
        el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px,' + y + 'px, 0)';
      },
      translateAndRotate: function translateAndRotate(el, x, y, angle) {
        el.style.transform = el.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px,0) rotate(' + angle + 'rad)';
      },
      resetTransitionTime: function(el) {
        el.style.transition = el.style.webkitTransition = 'none';
      },
      transitionTime: function(el, time) {
        el.style.transition = el.style.webkitTransition = 'all ' + time + 's ease-in-out';
      },
      transformKeys: keys
    };
  });
})();
