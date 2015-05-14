// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'patients'
angular.module('doctor').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/doctors', {
			templateUrl: 'doctors/views/list-doctor.client.view.html'
		})
	}
]); 