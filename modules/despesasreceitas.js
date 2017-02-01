var mongoose = require('mongoose');
var timestamps = require('mongoose-time');
var Schema = mongoose.Schema;

var schema = new Schema({
    descricao: {type: String},
    selectedCategoria: {type: String},
    tipo: {type: String},
    valor: {type: Number},
    dataDespesaReceita: {type: Date},
    repetir: {type: Boolean},
    fixaparcelada: {type: String},
    periodo: {type: String},
    parcela: {type: Number},
    hash: {type: String}
});

schema.plugin(timestamps());
module.exports = mongoose.model('DespesaReceita', schema);

