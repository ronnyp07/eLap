'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Result = mongoose.model('Result')

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
  var result = new Result(req.body);
  result.user = req.user;
  result.save(function(err) {
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
      res.jsonp(result);
    }
  });
};


exports.listpage = function(req, res) { 
     var count = req.query.count || 5;
     var page = req.query.page || 1;
     console.log(page);
     var endDate = new Date(req.query.endDate);
     var endDateYear = endDate.getFullYear();
     var endDateMonth = endDate.getMonth();
     var endDateDay = endDate.getDate() + 1;

     var startDate = new Date(req.query.startDate);
     var startDateYear = startDate.getFullYear();
     var startDateMonth = startDate.getMonth();
     var startDateDay = startDate.getDate() + 1;
    //  var startDateR = {
    //   day: startDate.getDay(),
    //   month: startDate.getMonth(),
    //   year: startDate.getYear()
    // };
     //var endDate = req.query.endDate;

    
    //var date = new Date(2015, 3, 15)
     //console.log(req.query.startDate);
  //  console.log(startDateR);
   // console.log(endDate);

     var pagination = {
      start : (page - 1) * count,
      count : count
     }

    var sort ={
      sort: {
        desc: '_id'
      }
     }
    
    var filter = {
      filters: {
       // field: ['reportname'],
           mandatory : {
            contains : {
                rSereal : req.query.filter
            }
             ,
               greaterThanEqual : {
                created : new Date(startDateYear, startDateMonth, startDateDay)
             }
            ,
            lessThanEqual : {
                created : new Date(endDateYear, endDateMonth, endDateDay)
            }
             
       }
     }
   }

    Result
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err,tempate){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tempate);
    }
    });
};

exports.getResultbyOrder = function(req, res){
      var orderId = req.query.orderId;
      console.log(orderId);
       Result
       .find({orders: req.query.orderId}).exec(function(err, patient){
          if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(patient);
        }
      });
};

exports.getResultbyId = function(req, res){
      var resultId = req.body.resultId;
      console.log(resultId);
       Result
       .find({_id: resultId}).populate('user', 'displayName').populate('orders').exec(function(err, result){
          if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(result);
        }
      });
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
  res.jsonp(req.result);
};


exports.resultByID = function(req, res, next, id) { 
  Result.findById(id).populate('user', 'displayName').populate('orders').exec(function(err, result) {
    if (err) return next(err);
    if (! result) return next(new Error('Failed to load procs ' + id));
    req.result = result ;
    console.log(result);
    next();
  });
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
  var result = req.result ;
     result.resultado = req.body.resultado;
     result.diagnostico = req.body.diagnostico;
     result.noAutho = req.body.noAutho;
     result.total = req.body.total;
     result.reportStatus = req.body.reportStatus;
  //   Result.firstName = req.body.firstName;
  //   Result.lastName = req.body.lastName;
  //   Result.ResultEmail = req.body.ResultEmail;
  //   Result.ResultTelefono = req.body.ResultTelefono;
  //   Result.ResultDireccion = req.body.ResultDireccion;
  //   Result.pais = req.body.pais;
  //   Result.ciudad = req.body.ciudad;
  //   Result.sector = req.body.sector;
  //   console.log(Result);

  result.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  });
};

/**
 * Delete an Pai
 */


/**
 * List of Pais
 */

 
