'use strict';

//Setting up route
angular.module('clientes').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/clientes', {
			templateUrl: 'clientes/views/list-clientes.client.view.html'
		})
		;
	}
]); 