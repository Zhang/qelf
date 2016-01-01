'use strict';

(function() {
  var app = angular.module('overlay', []);

  app.service('OverlayService', function() {
      return function(opts) {
        var overlay = $('#modal-overlay');

        function close() {
          overlay.fadeOut(opts.fadeSpeed || 300);
        }
        var clickFn = close;
        if (opts.onClick) {
          clickFn = function() {
            opts.onClick();
            close();
          };
        }

        this.open = function() {
          overlay.fadeIn(opts.fadeSpeed || 300);
        };
        this.close = function() {
          close();
          overlay.off('click', clickFn);
        };

        overlay.on('click', clickFn);

      };
  });
})();
