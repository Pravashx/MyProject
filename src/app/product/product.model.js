const mongoose = require('mongoose')

const AttributeSchema = new mongoose.Schema({
    key: String,
    value: [String]
})
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        min: 2,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: String,
    menu: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Menu",
            default: null
        }
    ],
    price: {
        type: Number,
        min: 1,
        required: true
    },
    discount: {
        type: Number,
        min: 0
    },
    afterDiscount: {
        type: Number,
        min: 1
    },
    attributes: [AttributeSchema],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    images: [String]
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})

const ProductModel = mongoose.model("Product", ProductSchema)
module.exports = ProductModel