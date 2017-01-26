var mongoose = require('mongoose');
var timestamps = require('mongoose-time');
var Schema = mongoose.Schema;

var schema = new Schema({
    cliente: {type: String},
    emissao: {type: Date},
    operacao: {type: String},
    categoria: {type: String},
    serie: {type: Number},
    venda: {type: Number},
    produto: {type: Array},
    pm: {type: Array},
    qtd: {type: Array},
    margem: {type: Array},
    val: {type: Array},
    prop: {type: Array},
    parc: {type: Array},
    vencimento: {type: Array},
    dataParc: {type: Array},
    parcFrete: {type: Array},
    hash: {type: String},
    hashId: {type: String}
});

schema.plugin(timestamps());
module.exports = mongoose.model('Venda', schema);