const mongoose = require('mongoose')
const PATSchemaDef = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    token:{
        type: String,
        required: true
    },
    refreshToken:{
        type: String,
        required: true
    }
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})

const PATModel = mongoose.model("PAT", PATSchemaDef)
module.exports = PATModel