'use strict';

(function() {
  var module = angular.module('share', []);

  module.factory('ShareService', function() {
    return {
      share: function() {
        if (window.cordova) {
          window.plugins.socialsharing.share('I\'m inviting you to use Qelf - an app that lets you see yourself other people\'s perspectives and answer questions like: \'What can I do to be better leader?\'. Check it out at http://www.Qelf.co', 'Check out Qelf');
        } else {
          //Bug opening a modal from another modal
          alert('Sharing is not available to web view');
        }
      }
    };
  });
})();
