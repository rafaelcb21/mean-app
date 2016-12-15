var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    fornecedores: [{label: String, value: {name: String, status: Boolean}}],
    operacao: [{label: String, value: {name: String, status: Boolean}}],
    categoria: [{label: String, value: {name: String, status: Boolean}}],
    produto: [{label: String, value: {name: String, status: Boolean}}],
    transportadora: [{label: String, value: {name: String, status: Boolean}}]
});


module.exports = mongoose.model('Lista', schema);