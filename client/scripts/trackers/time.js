'use strict';

(function() {
  var module = angular.module('time', []);

  module.controller('Time', function($scope) {
    $scope.time = new Date();
    $scope.time.setHours(12,0,0,0);
    $scope.submit = function() {
      $scope.onComplete({results: $scope.time});
    };
  });
  module.directive('time', function() {
    return {
      replace: true,
      scope: {
        onComplete: '&',
        text: '=',
        label: '='
      },
      restrict: 'E',
      templateUrl: 'scripts/trackers/time.html',
      controller: 'Time'
    };
  });

  module.controller("ClockPickerTestController", function () {
    this.time = new Date();
  });
  module.directive("clockpicker", function () {
    return {
      restrict: "EA",
      replace: true,
      templateUrl: "template/clockpicker.html",
      scope: {
        datetime: "=ngModel"
      },
      controller: function ($scope) {
        $scope.hourOptions = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        $scope.minuteOptions = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
        $scope.periodOptions = ['am', 'pm'];
        $scope.selectionMode = true;

        var timeMatches = /(\d{2}):(\d{2}):(\d{2})/.exec($scope.datetime.toString());

        $scope.hour = timeMatches[1];
        $scope.minute = timeMatches[2];
        $scope.period = "am";

        if ($scope.hour > 12) {
          $scope.hour = parseInt($scope.hour - 12);
          $scope.period = "pm";
        }

        var toggleOnSelection = false;
        var currentIndex = function () {
          if ($scope.selectionMode) {
            for (var i = 0; i < $scope.hourOptions.length; i++) {
              if ($scope.hourOptions[i] == $scope.hour) return i;
            }
          }
          else {
            for (var j = 0; j < $scope.hourOptions.length; j++) {
              if ($scope.minuteOptions[j] == $scope.minute) return j;
            }
          }
        };
        $scope.selectValue = function (value) {
          $scope.selectionMode ? $scope.hour = value : $scope.minute = value;
          if (toggleOnSelection) {
            $scope.selectionMode = !$scope.selectionMode;
          }
        };
        $scope.selectPeriod = function (value) {
          $scope.period = value;
        };
        $scope.togglePeriod = function () {
          $scope.selectPeriod($scope.period == "am" ? "pm" : "am");
        };
        $scope.lineStyle = function () {
          var angle = "rotate(" + (currentIndex() * 30 - 180) + "deg)";
          return "transform: " + angle + "; -webkit-transform: " + angle;
        };
        $scope.$watch("selectionMode", function (value) {
          $scope.options = value ? $scope.hourOptions : $scope.minuteOptions;
        });
        $scope.$watch("hour + period", function () {
          $scope.datetime.setHours($scope.period == "pm" ? $scope.hour + 12 : $scope.hour);
        });
        $scope.$watch("minute", function (value) {
          $scope.datetime.setMinutes(value);
        });
      }
    };
  })
  module.run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/clockpicker.html",
      "\n" +
      "<div class='ui-clockpicker'>\n" +
      "  <div class='ui-clockpicker-selection'>\n" +
      "    <a ng-click='selectionMode = true' ng-class='{selected: selectionMode}'>{{hour}}</a>:" +
      "<a ng-click='selectionMode = false' ng-class='{selected: !selectionMode}'>{{minute}}</a> " +
      "<a ng-click='togglePeriod()'>{{period}}</a>\n" +
      "  </div>\n" +
      "  <div class='ui-clockpicker-selector' ng-class='{minute: !selectionMode}'>\n" +
      "     <div class='ui-clockpicker-line' style='{{lineStyle()}}'></div>" +
      "     <ol class='ui-clockpicker-time'>\n" +
      "       <li ng-repeat='option in options' " +
      "         ng-class='{selected: selectionMode ? hour == option : minute == option }' " +
      "         ng-click='selectValue(option)'>{{option}}</li>\n" +
      "     </ol>\n" +
      "     <ol class='ui-clockpicker-period'>\n" +
      "       <li ng-repeat='periodOption in periodOptions' " +
      "         ng-class='{selected: period == periodOption }' " +
      "         ng-click='selectPeriod(periodOption)'>{{periodOption}}</li>\n" +
      "     </ol>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");
  }]);
})();
