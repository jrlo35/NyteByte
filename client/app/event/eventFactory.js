(function(){

  "use strict";

  angular
    .module('nytebyte.event')
		.factory('Events', Events);
		
		Events.$inject = ['$http'];	

		function Events($http) {
			var factory = {
		    sendNewEvent: sendNewEvent
		  };

		  return factory; 
		  
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
		  
		};
})();