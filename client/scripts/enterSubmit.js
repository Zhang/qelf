'use strict';

(function() {
  var module = angular.module('enterSubmit', []);
  module.directive('enterSubmit', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        var ENTER_KEYCODE = 13;
        if(event.which === ENTER_KEYCODE) {
          scope.$apply(function (){
              scope.$eval(attrs.enterSubmit);
          });

          event.preventDefault();
        }
      });
    };
  });
})();

