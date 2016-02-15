'use strict';

(function() {
  var app = angular.module('overlay', []);
  app.service('OverlayService', function() {
    return function(opts) {
      opts = opts || {};
      var overlay = $('#modal-overlay');
      var spinner = $('#spinner-container');
      var fadeSpeed = opts.fadeSpeed || 300;

      function close() {
        _.each([overlay, spinner], function(el) {
          el.fadeOut(fadeSpeed);
        });
      }

      var clickFn = close;
      if (opts.onClick) {
        clickFn = function() {
          opts.onClick();
          close();
        };
      }

      function fadeInElements(elements) {
        _.each(elements, function(el) {
          el.fadeIn(fadeSpeed);
        });
      }

      this.openSpinner = function() {
        opts.blockCloseOnClick = true;
        fadeInElements([overlay, spinner]);
      };
      this.open = function() {
        fadeInElements([overlay]);
      };
      this.close = function() {
        close();
        overlay.off('click', clickFn);
      };

      overlay.on('click', function() {
        if (opts.blockCloseOnClick) return;
        clickFn();
      });
    };
  });

  app.service('Spinner', function(OverlayService) {
    var spinner = new OverlayService();
    return {
      open: spinner.openSpinner,
      close: spinner.close
    };
  });
})();
