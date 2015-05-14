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
 
var TempresultSchema = new Schema({
	reportname: {
		type: String,
		required: 'Nombre de reporte requerido',
		trim: true
	},
    tipomuestra: {
    	type: String,
		trim: true
    },
	resultado:{
        type: String,
		trim: true
	},
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
	}
});


TempresultSchema.plugin(autoIncrement.plugin, {
    model: 'Tempresult',
    field: 'tempresultId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Tempresult', TempresultSchema);