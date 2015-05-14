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
var SectorSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Nombre del Sector requerido',
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
	ciudad: {
		type: Schema.ObjectId,
		ref: 'Ciudad'
	}
});


SectorSchema.plugin(autoIncrement.plugin, {
    model: 'Sector',
    field: 'sectorId',
    startAt: 100,
    incrementBy: 1
}
);

mongoose.model('Sector', SectorSchema);