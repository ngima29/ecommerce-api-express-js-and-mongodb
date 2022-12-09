const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        trim: true
    },
    product_price: {
        type: Number,
        required: true,

    },
    countInstock: {
        type: Number,
        required: true
    },
    product_description: {
        type: String,
        required: true,
        trim: true
    },
    product_image: {
        type: String,
        required: true
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'Category'
    },
    product_rating: {
        type: Number,
        default: 5,
        max: 5
    }

}, { tiimestamps: true })

module.exports = mongoose.model('Product', productSchema)