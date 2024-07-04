const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Product', productSchema);