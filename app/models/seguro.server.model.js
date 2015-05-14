'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;


    autoIncrement.initialize(mongoose);
/**
 * Pai Schema
 */
var PaiSchema = new Schema({
	name: {
		type: String,
		default: '',
		unique: true,
		required: 'Por favor inserte un pais',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'El pais es requerido',
	}
});

PaiSchema.plugin(autoIncrement.plugin, {
    model: 'Pais',
    field: 'paisId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Pais', PaiSchema);