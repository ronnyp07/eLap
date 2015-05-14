'use strict';

// Mensajeros controller
angular.module('mensajeros').controller('MensajerosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Mensajeros',
	function($scope, $stateParams, $location, Authentication, Mensajeros) {
		$scope.authentication = Authentication;

		// Create new Mensajero
		$scope.create = function() {
			// Create new Mensajero object
			var mensajero = new Mensajeros ({
				name: this.name
			});

			// Redirect after save
			mensajero.$save(function(response) {
				$location.path('mensajeros/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Mensajero
		$scope.remove = function(mensajero) {
			if ( mensajero ) { 
				mensajero.$remove();

				for (var i in $scope.mensajeros) {
					if ($scope.mensajeros [i] === mensajero) {
						$scope.mensajeros.splice(i, 1);
					}
				}
			} else {
				$scope.mensajero.$remove(function() {
					$location.path('mensajeros');
				});
			}
		};

		// Update existing Mensajero
		$scope.update = function() {
			var mensajero = $scope.mensajero;

			mensajero.$update(function() {
				$location.path('mensajeros/' + mensajero._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Mensajeros
		$scope.find = function() {
			$scope.mensajeros = Mensajeros.query();
		};

		// Find existing Mensajero
		$scope.findOne = function() {
			$scope.mensajero = Mensajeros.get({ 
				mensajeroId: $stateParams.mensajeroId
			});
		};
	}
]);