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
          return AccountAPI.getCurrentUser().then(function resolve(res) {
            $rootScope.user = res.data;
          }, function reject() {
            $state.go(STATE.login);
          });
        }
      }
    });
  });

  module.controller('Frame', function($scope, $rootScope, $state, STATE, SessionAPI, FBService, Modals) {
    $scope.isSelected = function(state) {
      return $state.current.name === STATE[state];
    };

    $scope.goTo = function(state) {
      if (STATE[state]) {
        $state.go(STATE[state]);
      } else if (state === 'lastState') {
        $state.go($scope.lastState || STATE.profile);
        $scope.lastState = '';
      } else {
        console.log('invalid state: ', state);
      }
    };

    $scope.openPopup = function() {
      $scope.popupItems = [{
        title: 'Leave Feedback',
        action: function() {
          $scope.lastState = $state.current.name;
          $state.go(STATE.feedback);
        }
      }, {
        title: 'Logout',
        action: function() {
          $state.go(STATE.login);
          // FBService.logout().then(function() {
          //   SessionAPI.logout().then(function() {
          //     $state.go(STATE.login);
          //   });
          // });
        }
      }];
      Modals.open($scope);
    };

    $scope.$on('$stateChangeSuccess', function(e, currentState) {
      $scope.isStandardView = currentState.name === STATE.trait || currentState.name === STATE.feedback;
    });
  });
})();
