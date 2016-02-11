'use strict';

(function() {
  var app = angular.module('states', []);

  app.constant('STATE', {
    login: 'login',
    signup: 'signup',
    frame: 'frame',
    profile: 'frame.profile',
    feedback: 'frame.feedback',
    trait: 'frame.trait',
    notConnected: 'notConnected',
    experiments: 'frame.experiments',
    reporting: 'frame.reporting',
    rating: 'frame.rating',
    trackers: 'frame.trackers'
  });
})();
