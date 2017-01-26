var mongoose = require('mongoose');
var timestamps = require('mongoose-time');
var Schema = mongoose.Schema;

var schema = new Schema({
    dataParc: {type: Date},
    fornecedor: {type: String},
    valorPgto: {type: Number},
    hash: {type: String}
});

schema.plugin(timestamps());
module.exports = mongoose.model('Fluxo', schema);
