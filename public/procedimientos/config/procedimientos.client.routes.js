'use strict';

//Setting up route
angular.module('procs').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/procs', {
			templateUrl: 'procedimientos/views/list-procedimientos.client.view.html'
		});
	}
]); 