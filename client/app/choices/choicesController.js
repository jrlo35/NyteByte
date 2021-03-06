(function (){

  "use strict";

  angular
    .module('nytebyte.choices', [])
    .controller('ChoiceController', ChoiceController);

    ChoiceController.$inject = ['Choice' ,'$routeParams', '$mdToast'];

    function ChoiceController(Choice, $routeParams, $mdToast) {
      
      var vm = this;
      vm.Choice = {
        'term': ''
      };

      // search results from Yelp
      vm.searchresults = [];
      
      // saved choices from users
      vm.savedChoices = [];
      
      vm.getChoices = getChoices;
      vm.getEventDetails = getEventDetails;
      vm.removeChoice = removeChoice;
      vm.sendChoice = sendChoice;
      vm.storeChoice = storeChoice;
      vm.updateVotes = updateVotes;


      function getEventDetails() {
        Choice.getEventDetails(function (data) {
          vm.eventId = data.event.event_id;
          vm.eventName = data.event.event_name;
          vm.location = data.event.location;
          vm.date = data.event.date;
          vm.time = time[0] + ':' + time[1] + " " + time[2].substr(-2);
          var votedBusiness = [];
          var changeToVotedBusiness = [];

          Choice.getChoices()
          .then(function (res) {
            $vm.savedChoices = [];
            res.data.length.forEach(function(){

            })
            for (var i = 0; i < res.data.length; i++) {
              // change image url for higher res image
              // size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
              res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
              $vm.savedChoices.push(res.data[i]);
            }

            //grab all the business id into an array
            data.event.choices.businesses.forEach(function (business) {
              if (business.ips.indexOf(data.ip) !== -1) {
                votedBusiness.push(business.business_id);
              }
            });

            // don't allow any ip address to vote more than once per card
            res.data.forEach(function (choice) {
              if (votedBusiness.indexOf(choice.id) !== -1) {
                choice.voted = true;
              }
              changeToVotedBusiness.push(choice);
            });
            //re-render choices array into DOM with updated values to disable button for user
            //on reload of page
            $vm.savedChoices = changeToVotedBusiness;
          })
          .catch(function (err) {
            return console.error('Error getting event data', err);
          });
        });
      };

      // search Yelp
      function sendChoice() {
        Choice.sendChoice(vm.Choice)
        .then(function (res, err) {
          vm.searchresults = [];
          res.forEach(function(yelpResult){
            vm.searchresults.push(yelpResult);
          })
        });
      };

      function removeChoice(choice) {
        var removeIndex = undefined;
        for (var i = 0; i < $vm.savedChoices.length; i++) {
          if ($vm.savedChoices[i].id === choice.id) {
            removeIndex = i;
          }
        }
        if (removeIndex !== undefined) {
          Choice.removeChoice(choice.id)
          .success(function success(response) {
            $vm.savedChoices.splice(removeIndex, 1);
            $mdToast.show({ position: 'top right', template: '<md-toast>Removed</md-toast>' });
          })
          .error(function error(error, status) {
            if (status === 418) {
              $mdToast.show({ position: 'top right', template: '<md-toast>User\'s votes exist</md-toast>' });
            } else if (status === 403) {
              $mdToast.show({ position: 'top right', template: '<md-toast>Must be user that submitted</md-toast>' });
            }
          });
        }
      };

      function getChoices() {
        Choice.getChoices()
        .then(function (res, err) {
          $vm.savedChoices = [];
          for (var i = 0; i < res.data.length; i++) {

            // Change image url for higher res image
            // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
            res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
            $vm.savedChoices.push(res.data[i]);
          }
        });
      };

      // save a search result as a choice
      function storeChoice(choice, index) {
        Choice.storeChoice(choice.id)
        .success(function success(response) {
          $vm.savedChoices.push(choice);
          $mdToast.show({ position: 'top right', template: '<md-toast>Saved</md-toast>' });
          vm.searchresults.splice(index, 1);
        })
        .error(function error(error, status) {
          if (status === 418) {
            $mdToast.show({ position: 'top right', template: '<md-toast>Limit reached</md-toast>' });
          }
        });
      };

      // upvoting of saved choices
      function updateVotes(choice) {
        Choice.updateVotes(choice)
        .then(function (resp) {

          // after clicking upvote button, immediately disable upvote button
          resp.data.event.users.forEach(function (user) {
            if (resp.data.business.ips.indexOf(user.ip) !== -1) {
              choice.voted = true;
            }
          });

          // update choice count locally
          $vm.savedChoices.forEach(function (choice) {
            if (choice.id === resp.data.business.business_id) {
              choice.votes = resp.data.business.votes;
            }
          });
        })
        .catch(function (err) {
          return console.error('Error updating vote', err);
        });
      };

    // Populate event details and saved choices on load
    vm.getEventDetails();

    }
})();
  
