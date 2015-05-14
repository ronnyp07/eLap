'use strict';

// Configuring the Articles module
angular.module('mensajeros').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('N', 'Mensajeros', 'mensajeros', 'dropdown', '/mensajeros(/create)?');
		Menus.addSubMenuItem('N', 'mensajeros', 'List Mensajeros', 'mensajeros');
		Menus.addSubMenuItem('N', 'mensajeros', 'New Mensajero', 'mensajeros/create');
	}
]);