var mongoose = require('mongoose');
var timestamps = require('mongoose-time');
var Schema = mongoose.Schema;

var schema = new Schema({
    fornecedor: {type: String},
    emissao: {type: Date},
    operacao: {type: String},
    categoria: {type: String},
    serie: {type: Number},
    nf: {type: Number},
    compra: {type: Number},
    produto: {type: Array},
    qtd: {type: Array},
    val: {type: Array},
    prop: {type: Array},
    parc: {type: Array},
    dataParc: {type: Array},
    transportadora: {type: String},
    parcFrete: {type: Array},
    vendido: {type: Boolean, default: false},
    hash: {type: String},
    hashId: {type: String}
});

schema.plugin(timestamps());
module.exports = mongoose.model('Produto', schema);