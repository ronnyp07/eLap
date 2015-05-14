'use strict';

//Mensajeros service used to communicate Mensajeros REST endpoints
angular.module('mensajeros').factory('Mensajeros', ['$resource',
	function($resource) {
		return $resource('mensajeros/:mensajeroId', { mensajeroId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);