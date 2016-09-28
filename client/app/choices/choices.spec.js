

describe('PreferenceController', function(){

	var $controller;
	var PreferenceController;
	var Preference;

	beforeEach(angular.mock.module('nytebyte.choices'));

	beforeEach(inject(function(_$controller_, _Preference_){
		$controller = _$controller_;
        Preference = _Preference_;

	}));

	PreferenceController = $controller('PreferenceController',{Preference: Preference});

	it('should be defined', function(){
		expect(PreferenceController).toBeDefined();
	});

	it('should exist', function(){
		expect(Preference).toBeDefined();
	});

    describe('sendPreference()', function(){
    	var result;
    	

    	it('should return 3 choices', function(){
    		var search = 'chinese';
            Preference.sendPreference(search)
            .then(function(res){
            	result = res;
            })
    		expect(result.length).toEqual(3);
    	});
    })
}) 