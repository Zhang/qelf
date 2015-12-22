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

  module.controller('Frame', function($scope, $rootScope, $state, STATE, SessionAPI, FBService, $ionicPopup) {
    $scope.isSelected = function(state) {
      return $state.current.name === STATE[state];
    };
    $scope.goTo = function(state) {
      if (STATE[state]) {
        $state.go(STATE[state]);
      } else {
        console.log('invalid state: ', state);
      }
    };
    $scope.logout = function() {
      FBService.logout().then(function() {
        SessionAPI.logout().then(function() {
          $state.go(STATE.login);
        });
      });
    };

    $scope.openPopover = function() {
      var alertPopup = $ionicPopup.alert({
       title: 'Don\'t eat that!',
       template: 'It might taste good'
      });

      alertPopup.then(function() {
       console.log('Thank you for not eating my delicious ice cream cone');
      });
    };
  });
})();
