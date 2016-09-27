(function(){

  "use strict";

  angular
    .module('nytebyte.event')
		.factory('Events', function ($http) {

			return {
		    sendNewEvent: sendNewEvent
		  };
		  function sendNewEvent(event) {
		    return $http({
		        method: 'POST',
		        url: '/create',
		        data: event
		      })
		      .then(function (res) {
		        return res.data;
		      })
		      .catch(function (err) {
		        return console.error('Error creating event data', err);
		      });
		  };
		  
		});
})();