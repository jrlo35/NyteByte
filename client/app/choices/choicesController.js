(function (){

  "use strict";

  angular
    .module('nytebyte.choices', [])
    .controller('PreferenceController', function ($scope, Preference, $routeParams, $mdToast) {
      
      $scope.preference = {
        'term': ''
      };

      // search results from Yelp
      $scope.searchresults = [];
      
      // saved choices from users
      $scope.choices = [];

      $scope.getEventDetails = function () {
        Preference.getEventDetails(function (data) {
          var time = data.event.time.split(":");
          $scope.eventId = data.event.event_id;
          $scope.eventName = data.event.event_name;
          $scope.location = data.event.location;
          $scope.date = data.event.date;
          $scope.time = time[0] + ':' + time[1] + " " + time[2].substr(-2);
          var votedBusiness = [];
          var changeToVotedBusiness = [];
          Preference.getChoices()
            .then(function (res) {
              $scope.choices = [];
              for (var i = 0; i < res.data.length; i++) {
                // change image url for higher res image
                // size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
                res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
                $scope.choices.push(res.data[i]);
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
              $scope.choices = changeToVotedBusiness;
            })
            .catch(function (err) {
              return console.error('Error getting event data', err);
            });
        });
      };

      // search Yelp
      $scope.sendPreference = function () {
        Preference.sendPreference($scope.preference)
          .then(function (res, err) {
            $scope.searchresults = [];

            // build array of search results from Yelp response
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].image_url === undefined) {
                res.data[i].image_url = Preference.getDefaultImage();
              }

              // Change image url for higher res image
              // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
              res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
              $scope.searchresults.push(res.data[i]);
            }
          });
      };

      $scope.removeChoice = function (choice) {
        var removeIndex = undefined;
        for (var i = 0; i < $scope.choices.length; i++) {
          if ($scope.choices[i].id === choice.id) {
            removeIndex = i;
          }
        }
        if (removeIndex !== undefined) {
          Preference.removeChoice(choice.id)
            .success(function success(response) {
              $scope.choices.splice(removeIndex, 1);
              $mdToast.show({ position: 'top right', template: '<md-toast>Removed</md-toast>' });
            }).error(function error(error, status) {
              if (status === 418) {
                $mdToast.show({ position: 'top right', template: '<md-toast>User\'s votes exist</md-toast>' });
              } else if (status === 403) {
                $mdToast.show({ position: 'top right', template: '<md-toast>Must be user that submitted</md-toast>' });
              }
            });
        }
      };

      $scope.getChoices = function () {
        Preference.getChoices()
          .then(function (res, err) {
            $scope.choices = [];
            for (var i = 0; i < res.data.length; i++) {

              // Change image url for higher res image
              // Size reference: http://stackoverflow.com/questions/17965691/yelp-api-ios-getting-a-larger-image
              res.data[i].image_url = res.data[i].image_url.substr(0, res.data[i].image_url.length - 6) + "ls.jpg";
              $scope.choices.push(res.data[i]);
            }
          });
      };

      // save a search result as a choice
      $scope.storeChoice = function (choice, index) {
        Preference.storeChoice(choice.id)
          .success(function success(response) {
            $scope.choices.push(choice);
            $mdToast.show({ position: 'top right', template: '<md-toast>Saved</md-toast>' });
            $scope.searchresults.splice(index, 1);
          }).error(function error(error, status) {
            if (status === 418) {
              $mdToast.show({ position: 'top right', template: '<md-toast>Limit reached</md-toast>' });
            }
          });
      };

      // upvoting of saved choices
      $scope.updateVotes = function (choice) {
        Preference.updateVotes(choice)
          .then(function (resp) {

            // after clicking upvote button, immediately disable upvote button
            resp.data.event.users.forEach(function (user) {
              if (resp.data.business.ips.indexOf(user.ip) !== -1) {
                choice.voted = true;
              }
            });

            // update choice count locally
            $scope.choices.forEach(function (choice) {
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
      $scope.getEventDetails();

    })
})();
  
