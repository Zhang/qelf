'use strict';

(function() {
  var module = angular.module('noConnection', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.notConnected, {
      url: '/noConnection',
      templateUrl: 'scripts/emptyStates/noConnection.html',
      controller: 'NoConnection'
    });
  });

  module.controller('NoConnection', function() {});
})();
