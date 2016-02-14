
'use strict';

(function() {
  var module = angular.module('login', []);
  module.config(function($stateProvider, STATE) {
    $stateProvider

    .state(STATE.login, {
      url: '/login',
      templateUrl: 'scripts/login/login.html',
      controller: 'Login',
      cache: false
    });
  });

  module.controller('Login', function($scope, $state, SessionAPI, STATE, AccountAPI, Modals) {
    $scope.isSignup = false;
    $scope.login = function login() {
      SessionAPI.login($scope.email, $scope.password).then(function resolve(res) {
        // var user = Ionic.User.current();

        // // if the user doesn't have an id, you'll need to give it one.
        // if (!user.id) {
        //   user.id = res.data.id;
        //   user.save();
        // }
        // var push = new Ionic.Push({
        //   "debug": true,
        //   onNotification: function(notification) {
        //     alert(notification)
        //   },
        //   pluginConfig: {
        //     ios: {
        //       badge: true,
        //       sound: true
        //     }
        //   }
        // });

        // push.register(function(token) {
        //   user.addPushToken(token);
        //   user.save()
        // });

        // user.save();
        $state.go(STATE.profile);
      }, function reject() {
        Modals.open(Modals.TYPES.alert, {
          text: 'Failed to login, please ensure you\'ve signed up before trying to log in',
          title: 'Login Error'
        });
      });
    };

    $scope.signup = function signup() {
      AccountAPI.create($scope.email, $scope.password).then(function resolve() {
        $state.go(STATE.experiments);
      }, function reject(err) {
        if (err.data === 'attempting to add duplicate user') {
          Modals.open(Modals.TYPES.alert, {
            text: 'An account associated with this facebook account already exists',
            title: 'Duplicate Account'
          });
        } else {
          Modals.open(Modals.TYPES.alert, {
            text: 'Looks like something went wrong with creating this account. Contact scottzhang235@gmail.com if this problem persists.',
            title: 'Failed to create account'
          });
        }
      });
    };

    $scope.toSignup = function() {
      $scope.isSignup = !$scope.isSignup;
    };
  });
})();
