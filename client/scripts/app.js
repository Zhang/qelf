'use strict';

(function() {
  var module = angular.module('sheen', [
    'ionic',
    'ngCookies',
    'ui.router',
    'ENV_VARS',
    'overlay',
    'modals',
    'states',
    'api',
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

  module.factory('FBService', function($q) {
    // If we're on a mobile platform use facebookConnectPlugin, otherwise dont
    if (window.cordova) {
      return {
        login: function() {
          var deferred = $q.defer();
          facebookConnectPlugin.login(['user_friends'], function(res) {
            if (res.authResponse) {
              deferred.resolve(res.authResponse);
            } else {
              deferred.reject('not authenticated');
            }
          }, function(err) {
            deferred.reject('not authenticated', err);
          });

          return deferred.promise;
        },
        getLoginStatus: function() {
          var deferred = $q.defer();
          facebookConnectPlugin.getLoginStatus(function(res) {
            if (res.status === 'connected') {
              deferred.resolve(res.authResponse);
            } else {
              deferred.reject('not connected');
            }
          }, function(err) {
              deferred.reject('not connected', err);
          });
          return deferred.promise;
        },
        logout: function() {
          var deferred = $q.defer();
          facebookConnectPlugin.logout(function() {
            deferred.resolve();
          });
          return deferred.promise;
        }
      };
    } else {
      return {
        login: function() {
          var deferred = $q.defer();
          FB.login(function(res) {
            if (res.authResponse) {
              deferred.resolve(res.authResponse);
            } else {
              deferred.reject('not authenticated');
            }
          }, {scope: 'user_friends'});
          return deferred.promise;
        },
        getLoginStatus: function() {
          var deferred = $q.defer();
          FB.getLoginStatus(function(res) {
            if (res.status === 'connected') {
              deferred.resolve(res.authResponse);
            } else {
              deferred.reject('not connected');
            }
          });
          return deferred.promise;
        },
        logout: function() {
          var deferred = $q.defer();
          FB.logout(function() {
            deferred.resolve();
          });
          return deferred.promise;
        }
      };
    }
  });

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
