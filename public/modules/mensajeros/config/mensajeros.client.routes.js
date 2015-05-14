'use strict';

//Setting up route
angular.module('mensajeros').config(['$stateProvider',
	function($stateProvider) {
		// Mensajeros state routing
		$stateProvider.
		state('listMensajeros', {
			url: '/mensajeros',
			templateUrl: 'modules/mensajeros/views/list-mensajeros.client.view.html'
		}).
		state('createMensajero', {
			url: '/mensajeros/create',
			templateUrl: 'modules/mensajeros/views/create-mensajero.client.view.html'
		}).
		state('viewMensajero', {
			url: '/mensajeros/:mensajeroId',
			templateUrl: 'modules/mensajeros/views/view-mensajero.client.view.html'
		}).
		state('editMensajero', {
			url: '/mensajeros/:mensajeroId/edit',
			templateUrl: 'modules/mensajeros/views/edit-mensajero.client.view.html'
		});
	}
]);