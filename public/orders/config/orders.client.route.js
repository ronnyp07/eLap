'use strict';

//Setting up route
angular.module('orders').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/orders', {
			templateUrl: 'orders/views/orders-clientes.client.view.html'
		}).
		when('/ordenesList', {
			templateUrl: 'orders/views/list-order.client.view.html'
		});
	}
]); 