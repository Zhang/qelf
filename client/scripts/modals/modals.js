'use strict';

(function() {
  var app = angular.module('modals', []);

  app.service('Modals', function($compile, OverlayService) {
    var FAST_FADE = 200;
    var template;
    $.get('scripts/modals/modal.html', function(_template) {
      template = _template;
    });
    return {
      open: function($scope) {
        function close() {
          overlay.close();
          $(compiledTemplate).remove();
          delete $scope.closePopup;
        }
        var overlay = new OverlayService({
          fadeSpeed: FAST_FADE,
          onClick: close
        });
        var compiledTemplate = $compile(template)($scope);
        compiledTemplate.css('display', 'none');
        $('#frame').append(compiledTemplate);
        $(compiledTemplate).fadeIn(FAST_FADE);
        overlay.open();


        $scope.closePopup = close;
      }
    };
  });
})();
