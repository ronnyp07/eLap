'use strict';

(function() {
	// Mensajeros Controller Spec
	describe('Mensajeros Controller Tests', function() {
		// Initialize global variables
		var MensajerosController,
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

			// Initialize the Mensajeros controller.
			MensajerosController = $controller('MensajerosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mensajero object fetched from XHR', inject(function(Mensajeros) {
			// Create sample Mensajero using the Mensajeros service
			var sampleMensajero = new Mensajeros({
				name: 'New Mensajero'
			});

			// Create a sample Mensajeros array that includes the new Mensajero
			var sampleMensajeros = [sampleMensajero];

			// Set GET response
			$httpBackend.expectGET('mensajeros').respond(sampleMensajeros);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mensajeros).toEqualData(sampleMensajeros);
		}));

		it('$scope.findOne() should create an array with one Mensajero object fetched from XHR using a mensajeroId URL parameter', inject(function(Mensajeros) {
			// Define a sample Mensajero object
			var sampleMensajero = new Mensajeros({
				name: 'New Mensajero'
			});

			// Set the URL parameter
			$stateParams.mensajeroId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/mensajeros\/([0-9a-fA-F]{24})$/).respond(sampleMensajero);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mensajero).toEqualData(sampleMensajero);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Mensajeros) {
			// Create a sample Mensajero object
			var sampleMensajeroPostData = new Mensajeros({
				name: 'New Mensajero'
			});

			// Create a sample Mensajero response
			var sampleMensajeroResponse = new Mensajeros({
				_id: '525cf20451979dea2c000001',
				name: 'New Mensajero'
			});

			// Fixture mock form input values
			scope.name = 'New Mensajero';

			// Set POST response
			$httpBackend.expectPOST('mensajeros', sampleMensajeroPostData).respond(sampleMensajeroResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mensajero was created
			expect($location.path()).toBe('/mensajeros/' + sampleMensajeroResponse._id);
		}));

		it('$scope.update() should update a valid Mensajero', inject(function(Mensajeros) {
			// Define a sample Mensajero put data
			var sampleMensajeroPutData = new Mensajeros({
				_id: '525cf20451979dea2c000001',
				name: 'New Mensajero'
			});

			// Mock Mensajero in scope
			scope.mensajero = sampleMensajeroPutData;

			// Set PUT response
			$httpBackend.expectPUT(/mensajeros\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/mensajeros/' + sampleMensajeroPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid mensajeroId and remove the Mensajero from the scope', inject(function(Mensajeros) {
			// Create new Mensajero object
			var sampleMensajero = new Mensajeros({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Mensajeros array and include the Mensajero
			scope.mensajeros = [sampleMensajero];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/mensajeros\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMensajero);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.mensajeros.length).toBe(0);
		}));
	});
}());