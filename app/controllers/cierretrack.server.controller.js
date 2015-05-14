'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Cierre = mongoose.model('Cierre')

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
  var cierre = new Cierre(req.body);
  cierre.user = req.user;
  cierre.save(function(err) {
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
      res.jsonp(cierre);
    }
  });
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
  res.jsonp(req.cierre);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
  var cierre = req.cierre ; 
    cierre.cierreCI = req.body.cierreCI;
    cierre.firstName = req.body.firstName;
    cierre.lastName = req.body.lastName;
    cierre.cierreEmail = req.body.cierreEmail;
    cierre.cierreTelefono = req.body.cierreTelefono;
    cierre.cierreDireccion = req.body.cierreDireccion;
    cierre.pais = req.body.pais;
    cierre.ciudad = req.body.ciudad;
    cierre.sector = req.body.sector;
    console.log(cierre);

  cierre.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cierre);
    }
  });
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var cierre = req.cierre ;
  cierre.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cierre);
    }
  });
};

/**
 * List of Pais
 */
exports.list = function(req, res) {
 if(req.body.info.proType == 'B') {
  Cierre.find({year: req.body.info.year, month:req.body.info.month, proType:req.body.info.proType }).exec(function(err, result){
      if(err){
        console.log(err);
         return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      }else{
        res.jsonp(result);
      };
  });
}else if (req.body.info.proType == 'BL'){
    Cierre.find({year: req.body.info.year, proType: 'BL' }).exec(function(err, result){
      if(err){
         return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      }else{
        res.jsonp(result);
      };
  });
}else{
  Cierre.find({year: req.body.info.year, proType: 'P' }).exec(function(err, result){
      if(err){
         return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      }else{
        res.jsonp(result);
      };
  });
};
};


exports.updateCierre = function(req, res) {

  var query = "";
  var requestType = req.body.info.proType
  if(requestType == "B"){
    query = {year: req.body.info.year, month:req.body.info.month, proType:req.body.info.proType };
  console.log(query);
  }else if (requestType == "BL"){
     query = {year: req.body.info.year,  proType:req.body.info.proType };
  }else {
    query = {year: req.body.info.year,  proType:req.body.info.proType }; 
  }

  
  
  Cierre.findOne(query, function(err, doc){
     if(err) throw err;
     if(doc){
        //var upCounter = parseInt(doc['counter']) + parseInt(req.body.info.newCount);
        var upCounter = parseInt(req.body.info.newCount);
        var opertation = {'$set': {'counter': upCounter}};
        Cierre.update(query, opertation, function(err, updated){
            if(err){
         return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
        });
        }else{
          res.jsonp(updated);
        }; 
        });
     }

  });

  

};

/**
 * Pai middleware
 */
exports.cierreByID = function(req, res, next, id) { 
  Cierre.findById(id).populate('user', 'displayName').exec(function(err, cierre) {
    if (err) return next(err);
    if (! cierre) return next(new Error('Failed to load cierre ' + id));
    req.cierre = cierre ;
    next();
  });
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.cierre.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};

exports.cerrarmonth = function(req, res, next){
 
};


exports.lastcierre = function(req, res, next){
    Cierre.nextCount(function(err, count) {
    
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(count);
    }

   });
};