/*global facebookConnectPlugin, FB*/
'use strict';

(function() {
  var module = angular.module('facebook', []);

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
})();
