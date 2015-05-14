'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/user.server.controller');
	var ciudad = require('../../app/controllers/ciudad.server.controller');

	// Pais Routes
	app.route('/api/ciudad')
		.get(ciudad.list)
		.post(users.requiresLogin, ciudad.create);

	app.route('/api/ciudad/:ciudadId')
		.get(ciudad.read)
		.put(users.requiresLogin, ciudad.hasAuthorization, ciudad.update)
		.delete(users.requiresLogin, ciudad.hasAuthorization, ciudad.delete);

	// Finish by binding the Ciudad middleware
	app.param('ciudadId', ciudad.ciudadByID);
};
