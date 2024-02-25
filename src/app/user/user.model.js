const mongoose = require('mongoose')

const userSchemaDef = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    image: {
        type: String
    },
    address: {
        shipping: {
            type: String
        },
        billing: {
            type: String
        }
    },
    role: {
        type: String,
        enum: ["admin", "seller", "customer"],
        default: "customer"
    },
    phone: {
        type: String,
        required: true
    },
    token: String,
    resetToken: String,
    resetExpiry: {
        type: Date,
    }
}, {
    // CreatedAt UpdatedAt
    timestamps: true,
    autoCreate: true,
    autoIndex: true
});

const UserModel = mongoose.model("User", userSchemaDef)

module.exports = UserModel;