'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Clientes = mongoose.model('Clientes')



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
	var clientes = new Clientes(req.body);
	clientes.user = req.user;

	clientes.save(function(err) {
		if (err) {
			if(err.code === 11000){
              return res.status(401).send({
					      message: 'Pais ya existe'
			    });
            }else {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		  }
		} else {
			res.jsonp(clientes);
		}
	});
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
	res.jsonp(req.cliente);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
	var cliente = req.cliente ; 
    cliente.name = req.body.name;
    cliente.tipo = req.body.tipo;
    cliente.clienteRNC = req.body.clienteRNC;
    cliente.clienteTelefono = req.body.clienteTelefono;
    cliente.pais = req.body.pais;
	cliente.ciudad = req.body.ciudad;
	cliente.sector = req.body.sector;
	cliente.clienteDireccion = req.body.clienteDireccion;
    

	cliente.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
	});
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var cliente = req.cliente ;
	cliente.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
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
     		field: ['name', 'clienteRNC', 'clienteTelefono'],
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
    
    Clientes
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err, cliente){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(cliente);
		}
    });
};

exports.getList = function(req, res) { 
   Clientes
    .find().exec(function(err, patient){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
    });
};




/**
 * Pai middleware
 */
exports.clientesByID = function(req, res, next, id) { 
	Clientes.findById(id).populate('user', 'displayName').exec(function(err, cliente) {
		if (err) return next(err);
		if (! cliente) return next(new Error('Failed to load cliente ' + id));
		req.cliente = cliente ;
		next();
	});
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.cliente.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
