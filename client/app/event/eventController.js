(function (){
  
  "use strict";

  angular
    .module('nytebyte.event', [])
    .controller('EventController', EventController);
      
    EventController.$inject = ['Events', '$location'];

    function EventController(Events, $location) {
      
      var vm = this;
      vm.event = {};
      vm.sendNewEvent = sendNewEvent;

      //set default choices of radius to show in home page
      vm.radius = [1, 5, 10, 15, 20, 25];

      //show default date in home page in calendar
      vm.event.date = new Date();
      vm.newDate = new Date();

      //filter out dates from today and on, so user cannot create event from dates that is passed
      vm.minDate = new Date(
        vm.newDate.getFullYear(),
        vm.newDate.getMonth(),
        vm.newDate.getDate()
      );

      // send event creation details to server; get back unique event id
      function sendNewEvent() {
        vm.event.time = vm.event.time.toLocaleTimeString();
        vm.event.date = vm.event.date.toDateString();
        Events.sendNewEvent(vm.event)
        .then(function (data) {

          // redirect to new unique event url
          $location.path('/' + data.event_id);
        });
      };
    }
})();
