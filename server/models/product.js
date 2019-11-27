const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Product', productSchema);