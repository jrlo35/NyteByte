
(function(){
  
  "use strict";

  angular
    .module('nytebyte.choices')
	  .factory('Choice', Choice);

		Choice.$inject = ['$http', '$routeParams'];

		function Choice($http, $routeParams) {

		  	var factory = {
		      sendChoice: sendChoice,
		      getChoices: getChoices,
		      storeChoice: storeChoice,
		      getEventDetails: getEventDetails,
		      removeChoice: removeChoice,
		      notInChoices: notInChoices,
		      getDefaultImage: getDefaultImage,
		      updateVotes: updateVotes
		    };

		    return factory;

		    // get search results from Yelp
		    function sendChoice(term) {
		      var yelpResult = [];
		      return $http({
		        method: 'Get',
		        url: '/' + $routeParams.event_id + '/search',
		        params: term
		      })
		      .then(function(res){
	          for (var i = 0; i < res.data.length; i++) {
	            if (res.data[i].image_url === undefined) {
	              res.data[i].image_url = Choice.getDefaultImage();
	            }

	            // Change image url for higher res image
	            // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
	            res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
	          }  
		        yelpResult.push(res.data[i])
		      })
		      return yelpResult;
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
		      })
		    };

		    function removeChoice(business_id) {
		      return $http({
		        method: 'Post',
		        url: '/' + $routeParams.event_id + '/remove',
		        data: {
		          id: business_id
		        }
		      })
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
		  };
})();