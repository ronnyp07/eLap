'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	autoIncrement = require('mongoose-auto-increment');
    autoIncrement.initialize(mongoose);

/**
 * Sector Schema
 */
 
var ResultSchema = new Schema({
	rSereal: {
		type: String,
		required: 'Nombre de reporte requerido',
		trim: true
	},
    tipomuestra: {
    	type: String,
		trim: true
    },
    tipomuestraDesc: {
    	type: String,
		trim: true
    },
    reportStatus: {
    	type: String,
		trim: true
    },   
    total: {
		type: Number,
		trim: true
	},
	noAutho: {
		type: String,
		trim: true
	},
	status: {
		type: String,
		trim: true
	},
	resultado: 
	[{}],
	
    tecnica: {
        type: String,
		trim: true
    },
    nota: {
        type: String,
		trim: true
    },
    diagnostico: {
    	type: String,
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

	orders: {
		type: Schema.ObjectId,
		ref: 'orders'
	}
});


ResultSchema.plugin(autoIncrement.plugin, {
    model: 'Result',
    field: 'ResultId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Result', ResultSchema);