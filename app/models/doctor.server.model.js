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
var DoctorSchema = new Schema({

	 DoctorCI: {
	    tipo : {type: String, trim: true},
	    value: {type: String, trim: true}
	 },

	firstName:{
		type: String,
		trim: true
	},

	lastName:{
      type: String,
	  trim: true
	},

    DoctorTelefono: {
    	type: String,
		trim: true	
    },

    DoctorEmail: {
    	type: String,
		trim: true	
    },

    DoctorDireccion: {
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

DoctorSchema.plugin(autoIncrement.plugin, {
    model: 'Doctor',
    field: 'DoctorId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Doctors', DoctorSchema);