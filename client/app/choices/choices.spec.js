

describe('ChoiceController', function(){
    
  //Angular convention 
	var $controller;
	var ChoiceController;
	var Choice;
  
  //run code before each test is executed
	beforeEach(angular.mock.module('nytebyte.choices'));

	beforeEach(inject(function(_$controller_, _Choice_){
		$controller = _$controller_;
    Choice = _Choice_;

	}));

	ChoiceController = $controller('ChoiceController',{Choice: Choice});

	it('should be defined', function(){
		expect(ChoiceController).toBeDefined();
	});

	it('should exist', function(){
		expect(Choice).toBeDefined();
	});

    describe('sendChoice()', function(){
    	var result;

    	it('should exist', function(){
    		expect(Choice.sendChoice).toBeDefined();
    	})

    	it('should return 3 choices', function(){
    		var search = 'chinese';
        Choice.sendChoice(search)
        .then(function(res){
        	result = res;
        })
    		expect(result.length).toEqual(3);
    	});

    })
    describe('factory methods should exist', function(){
    	it('should exist', function(){
    	  expect(Choice.getEventDetails).toBeDefined();
    	  expect(Choice.removeChoice).toBeDefined();
    	  expect(Choice.sendChoice).toBeDefined();
    	  expect(Choice.storeChoice).toBeDefined();
    	  expect(Choice.updateVotes).toBeDefined();	
    	})
    })
}) 