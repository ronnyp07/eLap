'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Mensajero = mongoose.model('Mensajero'),
	_ = require('lodash');

/**
 * Create a Mensajero
 */
exports.create = function(req, res) {
	var mensajero = new Mensajero(req.body);
	mensajero.user = req.user;

	mensajero.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mensajero);
		}
	});
};

/**
 * Show the current Mensajero
 */
exports.read = function(req, res) {
	res.jsonp(req.mensajero);
};

/**
 * Update a Mensajero
 */
exports.update = function(req, res) {
	var mensajero = req.mensajero ;

	mensajero = _.extend(mensajero , req.body);

	mensajero.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mensajero);
		}
	});
};

/**
 * Delete an Mensajero
 */
exports.delete = function(req, res) {
	var mensajero = req.mensajero ;

	mensajero.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mensajero);
		}
	});
};

/**
 * List of Mensajeros
 */
exports.list = function(req, res) { 
	Mensajero.find().sort('-created').populate('user', 'displayName').exec(function(err, mensajeros) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(mensajeros);
		}
	});
};

/**
 * Mensajero middleware
 */
exports.mensajeroByID = function(req, res, next, id) { 
	Mensajero.findById(id).populate('user', 'displayName').exec(function(err, mensajero) {
		if (err) return next(err);
		if (! mensajero) return next(new Error('Failed to load Mensajero ' + id));
		req.mensajero = mensajero ;
		next();
	});
};

/**
 * Mensajero authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.mensajero.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
