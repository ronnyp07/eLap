'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Pai Schema
 */
var CiudadSchema = new Schema({
	name: {
		type: String,
		default: '',
		unique: true,
		required: 'Por favor inserte una ciudad',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

    pais: {
		type: Schema.ObjectId,
		ref: 'Pais'
	}
});

mongoose.model('Ciudad', CiudadSchema);