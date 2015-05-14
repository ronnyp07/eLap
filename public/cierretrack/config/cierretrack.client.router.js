'use strict';

//Setting up route
angular.module('cierre').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/cierre', {
			templateUrl: 'cierretrack/views/create-cierretrack.client.view.html'
		});
	}
]); 