'use strict';

(function() {
  var app = angular.module('modals', []);

  app.service('Modals', function($compile, OverlayService) {
    var FAST_FADE = 200;
    var template;
    $.get('scripts/modals/modal.html', function(_template) {
      template = _template;
    });
    var overlay = new OverlayService({
      fadeSpeed: FAST_FADE
    });
    return {
      open: function($scope) {
        var compiledTemplate = $compile(template)($scope);
        compiledTemplate.css('display', 'none');
        $('#frame').append(compiledTemplate);
        $(compiledTemplate).fadeIn(FAST_FADE);
        overlay.open();

        function close() {
          overlay.close();
          compiledTemplate.remove();
          delete $scope.closePopup;
        }

        $scope.closePopup = close;
      }
    };
  });
})();
