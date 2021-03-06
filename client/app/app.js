(function(){

  "use strict";

  angular
    .module('nytebyte', [
      'nytebyte.choices',
      'nytebyte.event',
      'nytebyte.chat',
      'nytebyte.services',
      'ngMaterial',
      'ngRoute',
      'ngAnimate',
      'ngFx'
    ])

    .config(function ($locationProvider, $routeProvider, $httpProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'app/event/event.html',
          controller: 'EventController',
          controllerAs: 'event'
        })
        .when('/:event_id', {
          templateUrl: 'app/choices/choices.html',
          controller: 'ChoiceController',
          controllerAs: 'choice'
        });

      $locationProvider.html5Mode(true);
    })

    // Chat element directive
    .directive('chat', function () {
      return {
        restrict: 'E',
        controller: 'ChatController',
        templateUrl: '/app/chat/chatView.html'
      };
    });
})();