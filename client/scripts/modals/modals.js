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
      open: function($scope, customClass) {
        function close() {
          overlay.close();
          $(compiledTemplate).remove();
          delete $scope.closePopup;
          delete $scope.popupItems;
          delete $scope.popupTitle;
        }
        var overlay = new OverlayService({
          fadeSpeed: FAST_FADE,
          onClick: close
        });

        var LIST_LENGTH = $scope.popupItems.length;
        var distFromTop = (function() {
          if (LIST_LENGTH < 3) return '40%';
          if (LIST_LENGTH < 6) return '25%';
          return '10%';
        })();
        var compiledTemplate = $compile(template)($scope);
        compiledTemplate.css('display', 'none');
        compiledTemplate.css('top', distFromTop);
        $(compiledTemplate).addClass(customClass || '');
        $('#frame').append(compiledTemplate);
        $(compiledTemplate).fadeIn(FAST_FADE);
        overlay.open();


        $scope.closePopup = close;
      }
    };
  });
})();
