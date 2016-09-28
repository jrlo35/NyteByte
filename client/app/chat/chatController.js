(function(){

  "use strict";

  angular
    .module('nytebyte.chat', [])
    .controller('ChatController', ChatController);

    ChatController.$inject = ['socket'];

    function (socket) {

      var vm = this;
      // binding for displayed chat messages
      vm.messages = [];
      vm.sendMessage = sendMessage;

      // initialize the chat with existing messages
      socket.on('init', function (data) {
        vm.messages = data.messages;
      });

      // add messages locally when received from server
      socket.on('send:message', function (message) {
        if (message.eventId === vm.eventId) {
          vm.messages.push(message);
        }
      });

      function sendMessage() {

        // send message to server
        socket.emit('send:message', {
          eventId: vm.eventId,
          name: vm.username,
          text: vm.messageText
        });

        // add the message to our model locally
        vm.messages.push({
          name: vm.username,
          text: vm.messageText
        });
        
        vm.messageText = '';
      };
    };
})();