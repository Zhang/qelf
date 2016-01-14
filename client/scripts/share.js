'use strict';

(function() {
  var module = angular.module('share', []);

  module.factory('ShareService', function() {
    return {
      share: function() {
        if (window.cordova) {
          window.plugins.socialsharing.share('Hey, I\'m inviting you to use Qelf, an app that let\'s you learn who you are from other people\'s perspectives. Check it out at www.Qelf.co', 'Check out Qelf');
        } else {
          //Bug opening a modal from another modal
          alert('Sharing is not available to web view');
        }
      }
    };
  });
})();
