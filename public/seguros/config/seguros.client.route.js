// Invocar modo JavaScript 'strict'
'use strict';
angular.module('seguros').config(['$routeProvider',
function($routeProvider) {
		$routeProvider.
		when('/seguros', {
			templateUrl: 'seguros/views/view-seguro.client.view.html'
		}).
		when('/seguros/create', {
			templateUrl: 'seguros/views/create-seguro.client.view.html'
		}).
		when('/seguros/:patientId', {
			templateUrl: 'seguros/views/view-seguro.client.view.html'
		}).
		when('/seguros/:patientId/edit', {
			templateUrl: 'seguros/views/edit-seguro.client.view.html'
		});
	}
]); 