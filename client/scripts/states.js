'use strict';

(function() {
  var app = angular.module('states', []);

  app.constant('STATE', {
    login: 'login',
    signup: 'signup',
    frame: 'frame',
    profile: 'frame.profile',
    feedback: 'frame.feedback',
    notConnected: 'notConnected',
    experiments: 'frame.experiments',
    trackers: 'frame.trackers'
  });
})();
