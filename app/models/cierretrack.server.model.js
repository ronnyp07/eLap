'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment'),
	Schema = mongoose.Schema;


    autoIncrement.initialize(mongoose);
/**
 * Proc Schema
 */
var CierreSchema = new Schema({
	year: {
		type: String,
		trim: true
	},
	month: {
		type: String,
		trim: true
	},
    proType: {
		type: String,
		trim: true
	},
	counter: {
      	type: Number,
		trim: true
	},	
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'El Procs es requerido',
	}
});

CierreSchema.plugin(autoIncrement.plugin, {
    model: 'Cierre',
    field: 'CierreId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Cierre', CierreSchema);