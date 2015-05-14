'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Orders = mongoose.model('orders')

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
  var order = new Orders(req.body);
  order.user = req.user;
  order.save(function(err) {
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
      res.jsonp(order);
    }
  });
};

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
  res.jsonp(req.order);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
  var order = req.order ; 
    order.orderCI = req.body.orderCI;
    order.firstName = req.body.firstName;
    order.lastName = req.body.lastName;
    order.orderEmail = req.body.orderEmail;
    order.orderTelefono = req.body.orderTelefono;
    order.orderDireccion = req.body.orderDireccion;
    order.pais = req.body.pais;
    order.ciudad = req.body.ciudad;
    order.sector = req.body.sector;

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};



/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var order = req.order ;
  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Pais
 */
exports.list = function(req, res) { 
     
     var count = req.query.count || 10;
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
    
     Orders
    .find()
    .filter(filter)
    .order(sort)
    .page(pagination, function(err, order){
      if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
    });
};


/**
 * Pai middleware
 */
exports.OrderByID = function(req, res, next, id) { 
  Orders.findById(id).populate('user', 'displayName').exec(function(err, order) {
    if (err) return next(err);
    if (! order) return next(new Error('Failed to load order ' + id));
    req.order = order ;
    next();
  });
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.order.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};

exports.cerrarmonth = function(req, res, next){
 
};


exports.lastOrder = function(req, res, next){
    Orders.nextCount(function(err, count) {
    
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(count);
    }

   });
};
