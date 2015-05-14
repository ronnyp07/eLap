'use strict';

//Setting up route
angular.module('ciudad').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/ciudad', {
			templateUrl: 'ciudad/views/list-ciudad.client.view.html'
		});
	}
]); 