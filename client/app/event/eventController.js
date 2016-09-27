(function (){
  
  "use strict";

  angular
    .module('nytebyte.event', [])
    .controller('EventController', ['$scope', 'Events', '$location', function ($scope, Events, $location) {
      $scope.event = {};

      //set default choices of radius to show in home page
      $scope.radius = [1, 5, 10, 15, 20, 25];

      //show default date in home page in calendar
      $scope.event.date = new Date();
      $scope.newDate = new Date();

      //filter out dates from today and on, so user cannot create event from dates that is passed
      $scope.minDate = new Date(
        $scope.newDate.getFullYear(),
        $scope.newDate.getMonth(),
        $scope.newDate.getDate()
      );

      // send event creation details to server; get back unique event id
      $scope.sendNewEvent = function () {
        $scope.event.time = $scope.event.time.toLocaleTimeString();
        $scope.event.date = $scope.event.date.toDateString();
        Events.sendNewEvent($scope.event)
          .then(function (data) {
            
            // redirect to new unique event url
            $location.path('/' + data.event_id);
          });
      };
    }])
})();
