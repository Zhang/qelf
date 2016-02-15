'use strict';

/*
  The frame comprises of consistent components across all views like the navbar
  The frame is responsible for defining consistent containing CSS structure for all underlying views
*/

(function() {
  var module = angular.module('frame', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.frame, {
      url: '',
      templateUrl: 'scripts/frame.html',
      abstract: true,
      cache: false,
      controller: 'Frame',
      resolve: {
        CurrentUser: function(AccountAPI, $rootScope, $state) {
          // Used for testing against test accts
          return AccountAPI.getCurrentUser().then(function resolve(res) {
            $rootScope.user = res.data;
          }, function reject() {
            $state.go(STATE.login);
          });
        }
      }
    });
  });

  module.controller('Frame', function($scope, $rootScope, $state, STATE, SessionAPI, Modals, ShareService, $timeout, Keyboard, Spinner) {
    $scope.isSelected = function(state) {
      return $state.current.name === STATE[state];
    };

    $scope.goTo = function(state) {
      if (Keyboard && Keyboard.close) {
        Keyboard.close();
      }
      //Necessary to wait because keyboard may not be out of viewport
      $timeout(function() {
        if (STATE[state]) {
          $state.go(STATE[state]);
        } else if (state === 'lastState') {
          $state.go($scope.lastState || STATE.profile);
          $scope.lastState = '';
        } else {
          console.log('invalid state: ', state);
        }
      });
    };

    $scope.openPopup = function() {
      var opts = {
        items: [
          {
            title: 'Leave Feedback',
            action: function(e) {
              e.preventDefault();
              $scope.lastState = $state.current.name;
              $state.go(STATE.feedback);
            }
          }, {
            title: 'Invite Friends',
            action: function(e) {
              e.preventDefault();
              ShareService.share();
            }
          },
          {
            title: 'Logout',
            action: function(e) {
              e.preventDefault();
              SessionAPI.logout().then(function() {
                $state.go(STATE.login);
              });
            }
          }
        ],
        title: 'Menu'
      };
      Modals.open(null, opts);
    };
    $scope.isStandardView = false;
    $scope.$on('$stateChangeStart', function(e, toState) {
      if (_.contains(toState.name, 'frame.')) Spinner.open();
    });
    $scope.$on('$stateChangeSuccess', function(e, currentState) {
      $scope.isStandardView = currentState.name === STATE.trackers || currentState.name === STATE.feedback;
    });
  });
})();
