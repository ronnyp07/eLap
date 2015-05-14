'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Doctor = mongoose.model('Doctors')



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
	var doctor = new Doctor(req.body);
	doctor.user = req.user;
	doctor.save(function(err) {
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
			res.jsonp(doctor);
		}
	});
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
	res.jsonp(req.doctor);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
	var doctor = req.doctor ; 
    doctor.DoctorCI = req.body.DoctorCI;
    doctor.firstName = req.body.firstName;
    doctor.lastName = req.body.lastName;
    doctor.DoctorEmail = req.body.DoctorEmail;
    doctor.DoctorTelefono = req.body.DoctorTelefono;
	doctor.DoctorDireccion = req.body.DoctorDireccion;
	doctor.pais = req.body.pais;
	doctor.ciudad = req.body.ciudad;
	doctor.sector = req.body.sector;

	doctor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctor);
		}
	});
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var doctor = req.doctor ;
	doctor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctor);
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
     		//field: ['firstName'],
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
    
    Doctor
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err, doctor){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctor);
		}
    });
};

exports.getList = function(req, res) { 
   Doctor
    .find().exec(function(err, doctor){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(doctor);
		}
    });
};



/**
 * Pai middleware
 */
exports.DoctorByID = function(req, res, next, id) { 
	Doctor.findById(id).populate('user', 'displayName').exec(function(err, doctor) {
		if (err) return next(err);
		if (! doctor) return next(new Error('Failed to load doctor ' + id));
		req.doctor = doctor ;
		next();
	});
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.doctor.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
