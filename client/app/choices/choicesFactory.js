
(function(){
  
  "use strict";

  angular
    .module('nytebyte.choices')
	  .factory('Preference', function ($http, $routeParams) {

	  	return {
	      sendPreference: sendPreference,
	      getChoices: getChoices,
	      storeChoice: storeChoice,
	      getEventDetails: getEventDetails,
	      removeChoice: removeChoice,
	      notInChoices: notInChoices,
	      getDefaultImage: getDefaultImage,
	      updateVotes: updateVotes
	    };

	    // get search results from Yelp
	    function sendPreference(term) {
	      return $http({
	        method: 'Get',
	        url: '/' + $routeParams.event_id + '/search',
	        params: term
	      });
	    };

	    function getChoices() {
	      var choicesArray = [];
	      return $http({
	        method: 'Get',
	        url: '/' + $routeParams.event_id + '/saved',
	      });
	    };

	    function storeChoice(business_id, index) {
	      return $http({
	        method: 'Post',
	        url: '/' + $routeParams.event_id + '/store',
	        data: {
	          id: business_id
	        }
	      });
	    };

	    function removeChoice(business_id) {
	      return $http({
	        method: 'Post',
	        url: '/' + $routeParams.event_id + '/remove',
	        data: {
	          id: business_id
	        }
	      });
	    };

	    function getEventDetails(cb) {
	      $http({
	          method: 'POST',
	          url: '/' + $routeParams.event_id + '/details',
	          data: $routeParams
	        })
	        .then(function (res) {
	          cb(res.data);
	        });
	    };

	    // update vote count
	    function updateVotes(choice) {
	      return $http({
	        method: 'POST',
	        url: '/' + $routeParams.event_id + '/votes',
	        data: choice
	      });
	    };

	    function notInChoices(newChoice, choices) {
	      for (var i = 0; i < choices.length; i++) {
	        if (choices[i].id === newChoice.id) {
	          return false;
	        }
	      }
	      return true;
	    };

	    function defaultImagePath() {
	      return '../../assets/default_business.jpg';
	    };

	    
	  });
})();