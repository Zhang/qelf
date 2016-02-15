'use strict';

(function() {
  var app = angular.module('modals', []);

  app.service('Modals', function($compile, OverlayService, $rootScope) {
    var TYPES = {
      email: 'email',
      generic: 'generic',
      alert: 'alert',
      sublist: 'sublist'
    };
    var genericTemplate;
    var emailTemplate;
    var alertTemplate;
    var sublistTemplate;
    $.get('scripts/modals/genericModal.html', function(_template) {
      genericTemplate = _template;
    });
    $.get('scripts/modals/emailSharing.html', function(_template) {
      emailTemplate = _template;
    });
    $.get('scripts/modals/alert.html', function(_template) {
      alertTemplate = _template;
    });
    $.get('scripts/modals/sublistModal.html', function(_template) {
      sublistTemplate = _template;
    });
    function getModalYPlacement(itemLength) {
      if (itemLength < 3) return '30%';
      if (itemLength < 6) return '20%';
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
      compiledTemplate.css('top', getModalYPlacement(_.size(_scope.items) || 0));
      $(compiledTemplate).addClass(_scope.customClass || '');
      $('body').append(compiledTemplate);

      $(compiledTemplate).fadeIn(FAST_FADE);
      overlay.open();
      _scope.closePopup = close;
    }

    return {
      open: function(type, opts) {
        if (type === TYPES.email) {
          openTemplate(emailTemplate, opts);
        } else if (type === TYPES.alert) {
          openTemplate(alertTemplate, opts);
        } else if (type === TYPES.sublist) {
          openTemplate(sublistTemplate, opts);
        } else {
          openTemplate(genericTemplate, opts);
        }
      },
      TYPES: TYPES
    };
  });
})();
