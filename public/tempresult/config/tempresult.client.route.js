// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'tempresult'
angular.module('tempresult').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/tempresult', {
			templateUrl: 'tempresult/views/list-tempresult.client.view.html'
		})
	}
]); 