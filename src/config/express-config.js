const express = require('express')
const router = require('../router/index')
const { MulterError } = require('multer')
const { ZodError } = require('zod')
const app = express()

// Body Parser
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/health', (req, res, next) => {
    res.send("Success >_<")
})
app.use('/v1', router)


// 404 Error Handling
app.use((req, res, next) => {
    res.status(404).json({
        result: "null",
        message: "Not Found",
        meta: "null"
    })
})

// Handle Different Type Of Error
app.use((error, req, res, next) => {
    console.log("GarbageCollector: ", error)
    let code = error.code ?? 500
    let message = error.message ?? "Internal Server Error"

    if (error instanceof MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            code= 400,
            message= error.message
        }
    }

    if(error instanceof ZodError){
        code = 400;
        let ZodErrors = error.errors;
        let msg= {}
        ZodErrors.map((err)=>{
            msg[err.path[0]]= err.message
        })
        message= "Validation Failure";
        result= msg
    }

    res.status(code).json({
        result: result,
        message: message,
        meta: null
    })
})

module.exports = app