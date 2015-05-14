// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Patients = mongoose.model('Patients');

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

// Crear un nuevo método controller para crear nuevos artículos
exports.create = function(req, res) {
	// Crear un nuevo objeto artículo
	var patient = new Patients(req.body);

	// Configurar la propiedad 'creador' del artículo
	patient.creador = req.user;
	//patient.PatientCI = [req.user.PatientCI];

	// Intentar salvar el artículo
	patient.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(patient);
		}
	});
};

exports.delete = function(req, res) {
  var patient = req.patient ;
  // console.log(req.cliente);
	patient.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};



exports.list = function(req, res) { 
     var count = req.query.count || 5;
     var page = req.query.page || 1;
     var filter = {
     	filters: {
     		field: ['name'],
     		mandatory: {
     			contains: req.query.filter
     		}
     	}
     }

     var pagination = {
     	start : (page - 1) * count,
     	count : count
     }

     var sort = {
     	sort: {
     		desc: '_id'
     	}
     }

    Patients
    .find()
    .filter(filter)
    .order(sort)
    .populate('pais')
    .populate('ciudad')
    .populate('sector')
    .populate('clientes')
    .page(pagination, function(err, patient){
    	if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
    });
};

exports.getList = function(req, res) { 
   Patients
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


exports.update = function(req, res) {
	var patient = req.patient ;
    patient.name = req.body.name;
    patient.PatientCI = req.body.PatientCI;
    patient.patientFirstName= req.body.patientFirstName;
    patient.patientLastName = req.body.patientLastName;
    patient.patientDOB = req.body.patientDOB;
    patient.patientEdad = req.body.patientEdad;
    patient.patientSexo = req.body.patientSexo;
    patient.patientEC = req.body.patientEC;
    patient.patientTelefono = req.body.patientTelefono;
    patient.clientes = req.body.clientes;
    patient.patientPolisa = req.body.patientPolisa;
    patient.patientDireccion = req.body.patientDireccion;
    patient.pais = req.body.pais;
    patient.ciudad = req.body.ciudad;
    patient.sector = req.body.sector;
	patient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(patient);
		}
	});
};


exports.read = function(req, res) {
	res.jsonp(req.patient);
};


exports.patientByID = function(req, res, next, id) { 
	Patients.findById(id).populate('user', 'displayName').exec(function(err, patient) {
		if (err) return next(err);
		if (! patient) return next(new Error('Failed to load procs ' + id));
		req.patient = patient ;
		next();
	});
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.patient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

