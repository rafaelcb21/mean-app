var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    label: {type: String},
    name: {type: String},
    status: {type: String, default: true}
});
module.exports = mongoose.model('Lista', schema);