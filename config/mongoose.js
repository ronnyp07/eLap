// Invocar el modo 'strict' de JavaScript
'use strict';

// Carga las dependencias del módulo
var	config = require('./config'),
	mongoose = require('mongoose');

   require('mongoose-middleware').initialize(mongoose);
// Definir el método de configuración de Mongoose
module.exports = function() {
	// Usar Mongoose para conectar a MongoDB
	var db = mongoose.connect(config.db);

	// Cargar el modelo 'User' 
	require('../app/models/user.server.model');
	require('../app/models/articles.server.model');
	require('../app/models/patients.server.model');
    require('../app/models/seguros.server.model');
    require('../app/models/pais.server.model');
    require('../app/models/ciudad.server.model');
    require('../app/models/sector.server.model');
    require('../app/models/clientes.server.model');
    require('../app/models/procedimiento.server.model');
    require('../app/models/doctor.server.model');
    require('../app/models/orders.server.model');
    require('../app/models/cierretrack.server.model');
    require('../app/models/tempresult.server.model');
    require('../app/models/result.server.model');

    // Cargar el modelo 'Article'
	//require('../app/models/article.server.model');

	// Devolver la instancia de conexión a Mongoose
	return db;
};


