'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var mensajeros = require('../../app/controllers/mensajeros.server.controller');

	// Mensajeros Routes
	app.route('/mensajeros')
		.get(mensajeros.list)
		.post(users.requiresLogin, mensajeros.create);

	app.route('/mensajeros/:mensajeroId')
		.get(mensajeros.read)
		.put(users.requiresLogin, mensajeros.hasAuthorization, mensajeros.update)
		.delete(users.requiresLogin, mensajeros.hasAuthorization, mensajeros.delete);

	// Finish by binding the Mensajero middleware
	app.param('mensajeroId', mensajeros.mensajeroByID);
};
