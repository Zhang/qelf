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
    'trait',
    'routines',
    'routine',
    'self',
    'new'
  ]);

  module.config(function($compileProvider, $httpProvider, $ionicConfigProvider) {
    $httpProvider.defaults.withCredentials = true;
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    $ionicConfigProvider.scrolling.jsScrolling(false);
  });

  module.run(function($ionicPlatform, $rootScope, $state, $timeout, STATE) {
    var io = Ionic.io();
    $ionicPlatform.ready(function() {
      var push = new Ionic.Push({
        "debug": true
      });

      push.register(function(token) {
        console.log('Device token:', token.token);
      });

      if (_.get(window, 'cordova.plugins.Keyboard')) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.Connection && navigator.connection.type === Connection.NONE) {
        $timeout(function() {
          $state.go(STATE.notConnected);
        });
      } else {
        $state.go(STATE.stroop);
      }
    });

    $rootScope.isIOS = ionic.Platform.isIOS();
    $rootScope.isAndroid = ionic.Platform.isAndroid();
    $rootScope.isWeb = !$rootScope.isIOS && !$rootScope.isAndroid;
    $rootScope.isConnected = false;
  });

  module.service('Mixpanel', function() {
    return window.mixpanel;
  });
  module.service('Keyboard', function() {
    return _.get(window, 'cordova.plugins.Keyboard');
  });
})();
