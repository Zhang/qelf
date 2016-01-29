'use strict';

(function() {
  var app = angular.module('states', []);

  app.constant('STATE', {
    login: 'login',
    signup: 'signup',
    frame: 'frame',
    voting: 'frame.voting',
    profile: 'frame.profile',
    feedback: 'frame.feedback',
    trait: 'frame.trait',
    walkthrough: 'walkthrough',
    notConnected: 'notConnected',
    routines: 'frame.routines',
    routine: 'frame.routine',
    self: 'frame.self'
  });
})();
