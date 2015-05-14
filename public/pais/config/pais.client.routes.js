'use strict';

//Setting up route
angular.module('pais').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/pais', {
			templateUrl: 'pais/views/list-pais.client.view.html'
		});
		// .
		// when('/pais/create', {
		// 	templateUrl: 'pais/views/create-pais.client.view.html'
		// }).
		// when('/pais/:paisId', {
		// 	templateUrl: 'pais/views/view-pais.client.view.html'
		// }).
		// when('/pais/:paisId/edit', {
		// 	templateUrl: 'pais/views/edit-pais.client.view.html'
		// });
	}
]); 