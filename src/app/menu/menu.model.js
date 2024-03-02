const mongoose = require('mongoose')

const MenuSchema = new mongoose.Schema({
    title: {
        type: String,
        min:3,
        unique: true,
        required: true
    },
    description: String,
    slug: {
        type: String,
        unique: true,
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Menu',
        required: false
    },
    image: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: 'inactive'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    autoCreate: true,
    autoIndex: true,
    timestamps: true
})

const MenuModel = mongoose.model("Menu", MenuSchema)
module.exports = MenuModel