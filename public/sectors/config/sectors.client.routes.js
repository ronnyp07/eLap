'use strict';

//Setting up route
angular.module('sector').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/sector', {
			templateUrl: 'sectors/views/list-sectors.client.view.html'
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