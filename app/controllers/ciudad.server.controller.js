'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ciudad = mongoose.model('Ciudad')



// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un eror de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Este Ciudad ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};


/**
 * Create a Ciudad
 */
exports.create = function(req, res) {
	var ciudad = new Ciudad(req.body);
	ciudad.user = req.user;
	ciudad.save(function(err) {
		if (err) {
			if(err.code === 11000){
              return res.status(401).send({
					      message: 'Ciudad ya existe'
			    });
            }else {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		  }
		} else {
			res.jsonp(ciudad);
		}
	});
};

/**
 * Show the current Ciudad
 */
exports.read = function(req, res) {
	res.jsonp(req.ciudad);
};

/**
 * Update a Ciudad
 */
exports.update = function(req, res) {
	var Ciudad = req.Ciudad ;

    Ciudad.name = req.body.name;
    Ciudad.pais = req.body.pais;

	Ciudad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Ciudad);
		}
	});
};

/**
 * Delete an Ciudad
 */
exports.delete = function(req, res) {
	var Ciudad = req.Ciudad ;

	Ciudad.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Ciudad);
		}
	});
};

/**
 * List of Ciudad
 */
exports.list = function(req, res) { 
	Ciudad.find().sort('-created').populate('user', 'displayName').populate('pais', 'name').exec(function(err, Ciudad) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(Ciudad);
		}
	});
};

// exports.list = function(req, res) { 
// 	Ciudad.find().sort('-created').populate('user', 'displayName').populate('pais', 'name').exec(function(err, Ciudad) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			res.jsonp(Ciudad);
// 		}
// 	});
// };




/**
 * Ciudad middleware
 */
exports.ciudadByID = function(req, res, next, id) { 
	Ciudad.findById(id).populate('user', 'displayName').exec(function(err, Ciudad) {
		if (err) return next(err);
		if (! Ciudad) return next(new Error('Failed to load Ciudad ' + id));
		req.Ciudad = Ciudad ;
		next();
	});
};

/**
 * Ciudad authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.Ciudad.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
