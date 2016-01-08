'use strict';

(function() {
  var module = angular.module('qelf', [
    'ionic',
    'ngCookies',
    'ui.router',
    'ENV_VARS',
    'facebook',
    'share',
    'enterSubmit',
    'overlay',
    'modals',
    'states',
    'api',
    'walkthrough',
    'login',
    'frame',
    'voting',
    'profile',
    'feedback',
    'trait'
  ]);

  module.config(function($compileProvider, $httpProvider, $urlRouterProvider) {
    $httpProvider.defaults.withCredentials = true;
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    $urlRouterProvider.otherwise('/voting');
  });

  module.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
    });
  });

  module.service('Mixpanel', function() {
    return window.mixpanel;
  });
})();
