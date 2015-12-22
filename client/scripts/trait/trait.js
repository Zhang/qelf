'use strict';

/*
  Trait view is a deep dive of an individual trait by user
*/

(function() {
  var module = angular.module('trait', []);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.trait, {
      url: '/trait/:id',
      templateUrl: 'scripts/trait/trait.html',
      controller: 'Trait',
      resolve: {
        ViewedTrait: function(TraitAPI, $stateParams) {
          return TraitAPI.getTrait($stateParams.id).then(function resolve(res) {
            return res.data;
          });
        }
      }
    });
  });

  module.controller('Trait', function(ViewedTrait, $scope) {
    $scope.trait = ViewedTrait;
  });
})();
