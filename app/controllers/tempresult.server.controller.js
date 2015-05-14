'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Template = mongoose.model('Tempresult')

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
  var template = new Template(req.body);
  template.user = req.user;
  template.save(function(err) {
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
      res.jsonp(template);
    }
  });
};


exports.listpage = function(req, res) { 
     var count = req.query.count || 5;
     var page = req.query.page || 1;
    

     var pagination = {
      start : (page - 1) * count,
      count : count
     }

    var filter = {
      filters: {
       // field: ['reportname'],
           mandatory : {
            contains : {
                reportname : req.query.filter
            }
      }
     }
   }


    console.log(pagination);
    Template
    .find()
    .filter(filter)
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

/**
 * Show the current Pai
 */
exports.read = function(req, res) {
  res.jsonp(req.Template);
};

/**
 * Update a Pai
 */
exports.update = function(req, res) {
  var Template = req.Template ; 
    Template.TemplateCI = req.body.TemplateCI;
    Template.firstName = req.body.firstName;
    Template.lastName = req.body.lastName;
    Template.TemplateEmail = req.body.TemplateEmail;
    Template.TemplateTelefono = req.body.TemplateTelefono;
    Template.TemplateDireccion = req.body.TemplateDireccion;
    Template.pais = req.body.pais;
    Template.ciudad = req.body.ciudad;
    Template.sector = req.body.sector;
    console.log(Template);

  Template.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Template);
    }
  });
};

/**
 * Delete an Pai
 */
exports.delete = function(req, res) {
  var Template = req.Template ;
  Template.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(Template);
    }
  });
};

/**
 * List of Pais
 */
exports.list = function(req, res) {
 if(req.body.info.proType == 'B') {
  Template.find({year: req.body.info.year, month:req.body.info.month, proType:req.body.info.proType }).exec(function(err, result){
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
    Template.find({year: req.body.info.year, proType: 'BL' }).exec(function(err, result){
      if(err){
         return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
      }else{
        res.jsonp(result);
      };
  });
}else{
  Template.find({year: req.body.info.year, proType: 'P' }).exec(function(err, result){
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


exports.updateTemplate = function(req, res) {

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

  
  
  Template.findOne(query, function(err, doc){
     if(err) throw err;
     if(doc){
        //var upCounter = parseInt(doc['counter']) + parseInt(req.body.info.newCount);
        var upCounter = parseInt(req.body.info.newCount);
        var opertation = {'$set': {'counter': upCounter}};
        Template.update(query, opertation, function(err, updated){
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
exports.TemplateByID = function(req, res, next, id) { 
  Template.findById(id).populate('user', 'displayName').exec(function(err, Template) {
    if (err) return next(err);
    if (! Template) return next(new Error('Failed to load Template ' + id));
    req.Template = Template ;
    next();
  });
};

/**
 * Pai authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.Template.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};

exports.cerrarmonth = function(req, res, next){
 
};


exports.lastTemplate = function(req, res, next){
    Template.nextCount(function(err, count) {
    
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(count);
    }

   });
};