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
    'noConnection',
    'walkthrough',
    'login',
    'frame',
    'voting',
    'profile',
    'feedback',
    'trait'
  ]);

  module.config(function($compileProvider, $httpProvider, $ionicConfigProvider) {
    $httpProvider.defaults.withCredentials = true;
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    $ionicConfigProvider.scrolling.jsScrolling(false);
  });

  module.run(function($ionicPlatform, $rootScope, $state, $timeout, STATE) {
    $ionicPlatform.ready(function() {
      if (_.get(window, 'cordova.plugins.Keyboard')) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      // if (window.Connection && navigator.connection.type === Connection.NONE) {
      //   $timeout(function() {
      //     $state.go(STATE.notConnected);
      //   });
      // } else {
      //   $state.go(STATE.voting);
      // }
    });

    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.isAndroid = ionic.Platform.isAndroid();
    $rootScope.isWeb = !$rootScope.isIOS && !$rootScope.isAndroid;
    $rootScope.isConnected = false;
  });

  module.service('Mixpanel', function() {
    return window.mixpanel;
  });
})();
