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
var OrderSchema = new Schema({
	clienteName: {
		type: String,
		trim: true
	},
	clienteId: {
		type: String,
		trim: true
	},

	clienteIc: {
			type: String,
			trim: true
    },
    proclist: [{
	    id : {type: String, trim: true},
	    name: { type: String, trim: true},
	    costo: {type: Number, trim: true},
	    procType: { type: String, trim: true}
	 }],

   nota: {
		type: String,
		trim: true
	},

	total: {
		type: Number,
		trim: true
	},
     
   patientEdad: {
    type: Number,
    trim: true
   },

    statusOrder: {
    	type: String,
		trim: true
    },
    
   fechaValida: {
		type: Date,
		default: Date.now
	},
   
   autorization:{
   	   type: String,
	   trim: true
   },
    
     patientName: {
		type: String,
		trim: true
	},

    patientId: {
		type: String,
		trim: true
	},
	
	patientIc: {
			type: String,
			trim: true
    },

    patientsClient: {
		type: Boolean,
		default: false
	},

   doctorName: {
		type: String,
		trim: true
	},
	doctorId: {
		type: String,
		trim: true
	},
	
	doctorIc: {
			type: String,
			trim: true
    },

    procInfo: {
	    tipo : {type: String, trim: true},
	    value: {type: String, trim: true}
	 },


    cliente: {
		type: Schema.ObjectId,
		ref: 'clientes'
	},

	doctor: {
		type: Schema.ObjectId,
		ref: 'doctors'
	},

	patients: {
		type: Schema.ObjectId,
		ref: 'Patients'
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

OrderSchema.plugin(autoIncrement.plugin, {
    model: 'order',
    field: 'orderId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('orders', OrderSchema);