
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SeguroSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  seguroNombre: {
    type: String,
    trim: true,
    required: 'El título no puede estar en blanco'
  },
  seguroTelefono: {
    type: String,
    trim: true
  },
  creador: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Seguros', SeguroSchema);