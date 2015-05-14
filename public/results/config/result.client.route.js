'use strict';

//Setting up route
angular.module('result').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/result', {
			templateUrl: 'result/views/result-clientes.client.view.html'
		}).
		when('/result/:resultId', {
			templateUrl: 'results/views/edit-result.client.view.html'
		});
	}
]); 