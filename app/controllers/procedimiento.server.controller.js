'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Procs = mongoose.model('Procs');



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
        message = 'Este Pais ya existe';
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
 * Create a Pai
 */
exports.create = function(req, res) {
	var procs = new Procs(req.body);
	procs.user = req.user;
    procs.save(function(err) {
		if (err) {
			if(err.code === 11000){
              return res.status(401).send({
					      message: 'Procedimiento ya existe'
			    });
            }else {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		  }
		} else {
			res.jsonp(procs);
		}
	});
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
	res.jsonp(req.procs);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
	var procs = req.procs ;

    procs.name = req.body.name;
    procs.costo = req.body.costo;
    procs.proType = req.body.proType;

	procs.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(procs);
		}
	});
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var procs = req.procs ;
  // console.log(req.cliente);
	procs.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(procs);
		}
	});
};

/**
 * List of Pais
 */
exports.list = function(req, res) { 
     
     var count = req.query.count || 5;
     var page = req.query.page || 1;

     var filter = {
     	filters: {
     		field: ['name', 'costo'],
     		mandatory: {
     			contains: req.query.filter
     		}
     	}
     }

     var pagination = {
     	start : (page - 1) * count,
     	count : count
     }

     var sort ={
     	sort: {
     		desc: '_id'
     	}
     }
    
    Procs
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err, procs){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(procs);
		}
    });

	// Clientes.find().sort('-created').populate('user', 'displayName').
	// exec(function(err, clientes) {
		
	// });
};

exports.getList = function(req, res) { 
    Procs
    .find().exec(function(err, procs){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(procs);
		}
    });

	// Clientes.find().sort('-created').populate('user', 'displayName').
	// exec(function(err, clientes) {
		
	// });
};



/*exports.listByPais = function(req, res) { 
	Clientes.find().sort('-created').populate('user', 'displayName').populate('pais', 'name').exec(function(err, ciudad) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp();
		}
	});
};*/

/**
 * Pai middleware
 */
exports.procsByID = function(req, res, next, id) { 
	Procs.findById(id).populate('user', 'displayName').exec(function(err, procs) {
		if (err) return next(err);
		if (! procs) return next(new Error('Failed to load procs ' + id));
		req.procs = procs ;
		next();
	});
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.procs.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
