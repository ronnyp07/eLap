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
var ClienteSchema = new Schema({
	name: {
		type: String,
		default: '',
		unique: true,
		required: 'Nombre de cliente es requerido',
		trim: true
	},
    tipo: {
		type: String,
		required: 'Tipo de cliente es requerido',
		trim: true
	},

    clienteRNC: {
    	type: String,
		trim: true
    },

    clienteTelefono: {
    	type: String,
		trim: true	
    },

    clienteDireccion: {
    	type: String,
		trim: true	
    },

    pais: {
		type: Schema.ObjectId,
		ref: 'Pais'
	},
	ciudad: {
		type: Schema.ObjectId,
		ref: 'Ciudad'
	},
	sector: {
		type: Schema.ObjectId,
		ref: 'Sector'
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

ClienteSchema.plugin(autoIncrement.plugin, {
    model: 'Cliente',
    field: 'clienteId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Clientes', ClienteSchema);