let mongoose = require('mongoose');
let unique = require('mongoose-unique-validator');

let AlumnoSchema = new mongoose.Schema({
    nombre: String,
    termino: String,
    email: {type: String, unique: true},
    curso: String,
    fecha: Object
});

AlumnoSchema.plugin(unique, {message: 'Ya existe un alumno con ese email'});

module.exports = mongoose.model('Alumno', AlumnoSchema);