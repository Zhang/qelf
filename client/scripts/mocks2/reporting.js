'use strict';

(function() {
  var module = angular.module('reporting', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.reporting, {
      url: '/reporting',
      templateUrl: 'scripts/mocks2/reporting.html',
      controller: 'Reporting'
    });
  });

  module.controller('Reporting', function($scope) {
  });
})();
