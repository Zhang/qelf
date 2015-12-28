'use strict';

(function() {
  var app = angular.module('modals', []);

  app.service('Modals', function($compile) {
    var template;
    $.get('scripts/modals/modal.html', function(_template) {
      template = _template;
    });
    var overlay = $('#modal-overlay');

    return {
      open: function($scope) {
        var compiledTemplate = $compile(template)($scope);
        $('#frame').append(compiledTemplate);
        overlay.show();

        function close() {
          overlay.hide();
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
