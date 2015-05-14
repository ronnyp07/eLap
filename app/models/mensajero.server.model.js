'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Mensajero Schema
 */
var MensajeroSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Mensajero name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Mensajero', MensajeroSchema);