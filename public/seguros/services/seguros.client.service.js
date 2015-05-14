// Crear el service 'patients'
angular.module('seguros')
.factory('Seguro', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/seguros/:seguroId', {
        seguroId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);