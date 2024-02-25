require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.MONGODB_NAME,
    autoCreate: true,
    autoIndex: true
}).then((success)=>{
    console.log("DB server connected...")
}).catch((exception)=>{
    console.log("Error establishing DB connection")
    process.exit(1)
})
