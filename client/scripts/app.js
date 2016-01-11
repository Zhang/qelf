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

  module.config(function($compileProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider) {
    $httpProvider.defaults.withCredentials = true;
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    $urlRouterProvider.otherwise('/voting');
    $ionicConfigProvider.scrolling.jsScrolling(false);
  });

  module.run(function($ionicPlatform, $rootScope, $state, $timeout, STATE) {
    console.log('wtf');
    $ionicPlatform.ready(function() {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if(window.Connection) {
        if (navigator.connection.type === Connection.NONE) {
          $timeout(function() {
            //$state.go(STATE.notConnected)
          })
        }
      }
    });

    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.isAndroid = ionic.Platform.isAndroid();
    $rootScope.isWeb = !$rootScope.isIOS && !$rootScope.isAndroid;
  });

  module.service('Mixpanel', function() {
    return window.mixpanel;
  });
})();
