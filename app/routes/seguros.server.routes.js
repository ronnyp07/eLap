// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/user.server.controller'),
	seguros = require('../../app/controllers/seguros.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'articles'  
	app.route('/api/seguros')
	   .get(seguros.list)
	   .post(seguros.create);

};