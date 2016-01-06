'use strict';

(function() {
  var app = angular.module('modals', []);
  //todo - open (opts) should be the signiture - remove passing scope
  app.service('Modals', function($compile, OverlayService, $rootScope) {
    var genericTemplate;
    var emailTemplate;

    $.get('scripts/modals/modal.html', function(_template) {
      genericTemplate = _template;
    });
    $.get('scripts/modals/emailSharing.html', function(_template) {
      emailTemplate = _template;
    });

    function getModalYPlacement(itemLength) {
      if (itemLength < 3) return '40%';
      if (itemLength < 6) return '25%';
      return '15%';
    }

    function openTemplate(template, opts) {
      var FAST_FADE = 200;
      var _scope = $rootScope.$new();
      angular.extend(_scope, opts);
      var overlay = new OverlayService({
        fadeSpeed: FAST_FADE,
        onClick: close
      });
      function close() {
        if (opts.onClose) {
          opts.onClose(_scope);
        }
        overlay.close();
        $(compiledTemplate).remove();
      }

      var compiledTemplate = $compile(template)(_scope);
      compiledTemplate.css('display', 'none');
      compiledTemplate.css('top', getModalYPlacement(_scope.items || 0));
      $(compiledTemplate).addClass(_scope.customClass || '');
      $('#frame').append(compiledTemplate);

      $(compiledTemplate).fadeIn(FAST_FADE);
      overlay.open();
      _scope.closePopup = close;
    }

    return {
      open: function(type, opts) {
        if (type === 'email') {
          openTemplate(emailTemplate, opts);
        } else {
          openTemplate(genericTemplate, opts);
        }
      }
    };
  });
})();
