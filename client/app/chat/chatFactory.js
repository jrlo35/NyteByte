(function(){

  "use strict";

  angular
    .module('nytebyte.chat')
    .factory('socket', socket);

    socket.$inject = ['$rootScope'];

    function socket($rootScope) {
      var socket = io.connect();
      var factory = {
        on: on,
        emit: emit
      }

      return factory;
        // socket 'on' event
      function on(eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }
      // socket 'emit' event
      function emit(eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
})();