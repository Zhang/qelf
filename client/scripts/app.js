'use strict';

(function() {
  var module = angular.module('sheen', [
    'ionic',
    'ngCookies',
    'ui.router',
    'ENV_VARS',
    'states',
    'api',
    'login',
    'signup',
    'frame',
    'voting',
    'profile',
    'feedback'
  ]);

  module.config(function($compileProvider, $httpProvider, $urlRouterProvider) {
    $httpProvider.defaults.withCredentials = true;
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    $urlRouterProvider.otherwise('/');
  });

  module.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
    });
  });
})();
