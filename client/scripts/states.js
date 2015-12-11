'use strict';

(function() {
  var app = angular.module('states', []);

  app.constant('STATE', {
    login: 'login',
    signup: 'signup',
    frame: 'frame',
    voting: 'frame.voting'
  });
})();
