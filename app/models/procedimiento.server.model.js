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
var ProcSchema = new Schema({
	name: {
		type: String,
		default: '',
		unique: true,
		required: 'Por favor inserte un Procedimiento',
		trim: true
	},
	costo: {
      	type: Number,
		trim: true
	},
    proType: {
		type: String,
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

ProcSchema.plugin(autoIncrement.plugin, {
    model: 'Procs',
    field: 'ProcsId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Procs', ProcSchema);