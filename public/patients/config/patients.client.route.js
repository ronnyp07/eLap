// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'patients'
angular.module('patients').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/patients', {
			templateUrl: 'patients/views/list-patients.client.view.html'
		})
	}
]); 