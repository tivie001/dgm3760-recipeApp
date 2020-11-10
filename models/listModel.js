const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    listTitle: String,
    items: Array
})

module.exports = mongoose.model('List', ListSchema);

