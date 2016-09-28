describe('ChatController', function(){

	var $controller;
	var ChatController;
	var socket;

	beforeEach(angular.mock.module('nytebyte.chat'));

	beforeEach(inject(function(_$controller_, _socket_){
		$controller = _$controller_;
        socket = _socket_;

	}));

	ChatController = $controller('ChatController',{socket: socket});

	it('should be defined', function(){
		expect(ChatController).toBeDefined();
	});

	it('should exist', function(){
		expect(socket).toBeDefined();
	});

	describe('factory methods should exist', function(){
		it('should exist', function(){
			expect(socket.on).toBeDefined();
			expect(socket.emit).toBeDefined();
		})
	})

  describe('emit()', function(){
  	var result;
  	var message =  {
        eventId: $scope.eventId,
        name: $scope.username,
        text: $scope.messageText
      };
  	

  	it('should emit message', function(){
  		var search = ;
          socket.emit('send:message',message)
          .then(function(res){
          	result = res;
          })
  		expect(result.length).toBeDefined();
  	});
  })
}) 