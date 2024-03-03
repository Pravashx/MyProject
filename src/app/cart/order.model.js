const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    billNo: {
        type: Number,
        require: true
    },
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true,
    },
    subTotal: {
        type: Number,
        require: true,
        min: 1
    },
    discount: {
        type: Number,
        min: 0
    },
    vatAmt: {
        type: Number,
    },
    deliveryCharge: {
        type: Number
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['new', 'pending', 'cancelled', 'delivered'],
        default: 'new'
    }
}, {
    autoCreate: true,
    autoIndex: true,
    timestamps: true
})

const OrderModel = mongoose.model("Order", OrderSchema)
module.exports = OrderModel