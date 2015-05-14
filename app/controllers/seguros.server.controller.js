// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Seguros = mongoose.model('Seguros');

// Crear un nuevo método controller para el manejo de errores
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};

// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Seguros.find().exec(function(err, seguros) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			console.log(seguros);
			// Enviar una representación JSON del artículo 
			res.json(seguros);
		}
	});
};


// Crear un nuevo método controller para crear nuevos seguro
exports.create = function(req, res) {
	// Crear un nuevo objeto artículo
	var seguro = new Seguros(req.body);

	// Configurar la propiedad 'creador' del artículo
	seguro.creador = req.user;
    
	// Intentar salvar el artículo
	seguro.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(seguro);
		}
	});
};


