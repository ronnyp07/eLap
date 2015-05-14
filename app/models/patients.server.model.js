'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    //config = require('../../app/config/express.js'),
    autoIncrement = require('mongoose-auto-increment');
    autoIncrement.initialize(mongoose);
     //console.log(mongoose.connections);

var PatientSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  PatientCI: {
    tipo : {type: String, trim: true},
    value: {type: String, trim: true}
  },
  patientFirstName: {
    type: String,
    trim: true,
    required: 'El nombre del paciente no puede estar en blanco'
  },
  patientLastName: {
    type: String,
    trim: true
  },
   patientDOB: {
    type: Date,
    trim: true
  },
   patientEdad: {
    type: Number,
    trim: true
  },

  patientSexo: {
    type: String,
    trim: true
  },

  patientEC: {
    type: String,
    trim: true
  },

  patientTelefono: {
    type: Number,
    trim: true
  },

  clientes: {
    type: Schema.ObjectId,
    ref: 'Clientes'
  },

  patientPolisa:{
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
  patientDireccion: {
    type: String,
    trim: true
  },
  creador: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});
PatientSchema.plugin(autoIncrement.plugin, {
    model: 'Patients',
    field: 'patientId',
    startAt: 100,
    incrementBy: 1
}
);
mongoose.model('Patients', PatientSchema);