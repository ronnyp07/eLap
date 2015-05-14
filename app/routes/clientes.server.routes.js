'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/user.server.controller');
	var clientes = require('../../app/controllers/clientes.server.controller');

	// clientes Routes
	app.route('/api/clientes')
		.get(clientes.list)
		.post(users.requiresLogin, clientes.create);

	app.route('/api/clientes/:clienteId')
		.get(clientes.read)
		.put(users.requiresLogin, clientes.hasAuthorization, clientes.update)
		.delete(users.requiresLogin, clientes.hasAuthorization, clientes.delete);
    
    app.route('/cliente/getList')
	   .post(clientes.getList);
	// Finish by binding the Pai middleware
	app.param('clienteId', clientes.clientesByID);
};