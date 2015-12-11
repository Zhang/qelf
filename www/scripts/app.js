'use strict';

(function() {
  var app = angular.module('sheen', [
    'ionic',
    'ngCookies',
    'ui.router',
    'ENV_VARS',
    'sheen.states',
    'sheen.api',
    'landingPage',
    'signup'
  ]);

  app.config(function($compileProvider, $httpProvider) {
     $httpProvider.defaults.withCredentials = true;
     $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  });

  app.run(function($ionicPlatform, $state) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
    });
    $state.go('landingPage');
  });
})();
