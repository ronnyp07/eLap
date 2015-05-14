'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = new mongoose.Schema;

var ArticuleSchema = new Schema({
 creado: {
 	type: Date,
    default: Date.now
 },
 
 titulo: {
 	 type: String,
 	 default: '',
 	 trim: true,
 	 required : 'El titulo es requerido'
 },
 contenido: {
 	type:String,
 	default: '',
 	trim: true
 },

 creador: {
 	type: Schema.ObjectId:
 	ref: 'User'
 }
 
});

mongoose.model('Articules', ArticuleSchema);