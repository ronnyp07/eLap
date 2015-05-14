'use strict';

// Configuring the Articles module
angular.module('pais').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Pais', 'pais', 'dropdown', '/pais(/create)?');
		Menus.addSubMenuItem('topbar', 'pais', 'List Pais', 'pais');
		Menus.addSubMenuItem('topbar', 'pais', 'New Pai', 'pais/create');
	}
]);