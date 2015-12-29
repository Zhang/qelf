'use strict';

(function() {
  var app = angular.module('modals', []);

  app.service('Modals', function($compile) {
    var FAST_FADE = 200;
    var SLOW_FADE = 300;
    var template;
    $.get('scripts/modals/modal.html', function(_template) {
      template = _template;
    });
    var overlay = $('#modal-overlay');

    return {
      open: function($scope) {
        var compiledTemplate = $compile(template)($scope);
        compiledTemplate.css('display', 'none');
        $('#frame').append(compiledTemplate);
        $(compiledTemplate).fadeIn(FAST_FADE);
        overlay.fadeIn(SLOW_FADE);

        function close() {
          overlay.fadeOut();
          compiledTemplate.remove();
          overlay.off('click', close);
          delete $scope.closePopup;
        }

        $scope.closePopup = close;
        overlay.on('click', close);
      }
    };
  });
})();
