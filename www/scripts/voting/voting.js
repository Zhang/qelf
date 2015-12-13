'use strict';

/*
  Voting comprises of voting logic
*/

(function() {
  var module = angular.module('voting', ['card']);

  module.config(function($stateProvider, STATE) {
    $stateProvider
    .state(STATE.voting, {
      url: '/voting',
      templateUrl: 'scripts/voting/voting.html',
      controller: 'Voting'
    });
  });

  module.controller('Voting', function($scope) {
    $scope.trait = {
      title: 'Trustworthiness'
    };
    $scope.swipe = function(dir) {
      console.log(dir);
    };
    $scope.contestants = [
      {
        name: 'This is scott',
        img: 'http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
        location: 'SF'
      },
      {
        name: 'This is scott with a much longer name nefrufru',
        img: 'http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
        location: 'San Francisco, California, also France'
      }
    ];
  });
})();
