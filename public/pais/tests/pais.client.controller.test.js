'use strict';

(function() {
	// Pais Controller Spec
	describe('Pais Controller Tests', function() {
		// Initialize global variables
		var PaisController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Pais controller.
			PaisController = $controller('PaisController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pai object fetched from XHR', inject(function(Pais) {
			// Create sample Pai using the Pais service
			var samplePai = new Pais({
				name: 'New Pai'
			});

			// Create a sample Pais array that includes the new Pai
			var samplePais = [samplePai];

			// Set GET response
			$httpBackend.expectGET('pais').respond(samplePais);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pais).toEqualData(samplePais);
		}));

		it('$scope.findOne() should create an array with one Pai object fetched from XHR using a paiId URL parameter', inject(function(Pais) {
			// Define a sample Pai object
			var samplePai = new Pais({
				name: 'New Pai'
			});

			// Set the URL parameter
			$stateParams.paiId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/pais\/([0-9a-fA-F]{24})$/).respond(samplePai);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pai).toEqualData(samplePai);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Pais) {
			// Create a sample Pai object
			var samplePaiPostData = new Pais({
				name: 'New Pai'
			});

			// Create a sample Pai response
			var samplePaiResponse = new Pais({
				_id: '525cf20451979dea2c000001',
				name: 'New Pai'
			});

			// Fixture mock form input values
			scope.name = 'New Pai';

			// Set POST response
			$httpBackend.expectPOST('pais', samplePaiPostData).respond(samplePaiResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pai was created
			expect($location.path()).toBe('/pais/' + samplePaiResponse._id);
		}));

		it('$scope.update() should update a valid Pai', inject(function(Pais) {
			// Define a sample Pai put data
			var samplePaiPutData = new Pais({
				_id: '525cf20451979dea2c000001',
				name: 'New Pai'
			});

			// Mock Pai in scope
			scope.pai = samplePaiPutData;

			// Set PUT response
			$httpBackend.expectPUT(/pais\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/pais/' + samplePaiPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid paiId and remove the Pai from the scope', inject(function(Pais) {
			// Create new Pai object
			var samplePai = new Pais({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Pais array and include the Pai
			scope.pais = [samplePai];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/pais\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePai);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.pais.length).toBe(0);
		}));
	});
}());