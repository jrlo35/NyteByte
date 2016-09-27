
(function(){
  
  "use strict";

  angular
    .module('nytebyte.choices')
	  .factory('Preference', function ($http, $routeParams) {
	  	
	    // in case business has no image associated with it on Yelp
	    var defaultImagePath = '../../assets/default_business.jpg';

	    // get search results from Yelp
	    var sendPreference = function (term) {
	      return $http({
	        method: 'Get',
	        url: '/' + $routeParams.event_id + '/search',
	        params: term
	      });
	    };

	    var getChoices = function () {
	      var choicesArray = [];
	      return $http({
	        method: 'Get',
	        url: '/' + $routeParams.event_id + '/saved',
	      });
	    };

	    var storeChoice = function (business_id, index) {
	      return $http({
	        method: 'Post',
	        url: '/' + $routeParams.event_id + '/store',
	        data: {
	          id: business_id
	        }
	      });
	    };

	    var removeChoice = function (business_id) {
	      return $http({
	        method: 'Post',
	        url: '/' + $routeParams.event_id + '/remove',
	        data: {
	          id: business_id
	        }
	      });
	    };

	    var getEventDetails = function (cb) {
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
	    var updateVotes = function (choice) {
	      return $http({
	        method: 'POST',
	        url: '/' + $routeParams.event_id + '/votes',
	        data: choice
	      });
	    };

	    var notInChoices = function (newChoice, choices) {
	      for (var i = 0; i < choices.length; i++) {
	        if (choices[i].id === newChoice.id) {
	          return false;
	        }
	      }
	      return true;
	    };

	    var getDefaultImage = function () {
	      return defaultImagePath;
	    };

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
	  });
})();