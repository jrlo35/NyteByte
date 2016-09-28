

describe('EventController', function(){

	var $controller;
	var EventController;
	var Events;

	beforeEach(angular.mock.module('nytebyte.event'));

	beforeEach(inject(function(_$controller_, _Events_){
		$controller = _$controller_;
        Events = _Events_;

	}));

	EventController = $controller('EventController',{Events: Events});

	it('should be defined', function(){
		expect(EventController).toBeDefined();
	});

	it('should exist', function(){
		expect(Events).toBeDefined();
	});

    describe('sendNewEvent()', function(){
    	var result;
    	var date = new Date();
    	var time = new Date(Date.UTC(2016,11,12,3,0,0)).toLocaleTimeString(); 
    	var usersArray =[];
    	var event = {
          event_id: 5,
          event_name: 'Some Event',
          location: 'Sunnyvale',
          date: date,
          time: time,
          radius: 5,
          users: usersArray
        };
    	

    	it('should return new event', function(){
            Events.sendNewEvent(event)
            .then(function(res){
            	result = res;
            })
    		expect(result.event_id).toBeDefined();
    	});
    })
}) 