require('./db.config')
const express = require('express')
const app = express()
const cors = require('cors')

const router = require('../router/index')
const { MulterError } = require('multer')
const { ZodError } = require('zod')
const event = require('./event.config')

app.use(cors());

// Body Parser
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/health', (req, res, next) => {
    res.send("Success >_<")
})
app.use(event)
app.use('/v1', router)


// 404 Error Handling
app.use((req, res, next) => {
    next({ code: 404, message: "Not Found" })
})

// Handle Different Type Of Error
app.use((error, req, res, next) => {
    console.log("GarbageCollector: ", error)
    let code = error.code ?? 500
    let message = error.message ?? "Internal Server Error"
    let result = error.result ?? null
    if (error instanceof MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            code = 400,
                message = error.message
        }
    }

    if (error instanceof ZodError) {
        code = 400;
        let ZodErrors = error.errors;
        let msg = {}
        ZodErrors.map((err) => {
            msg[err.path[0]] = err.message
        })
        message = "Validation Failure";
        result = msg
    }

    if (error.code === 11000) {
        code = 400
        let uniqueKeys = Object.keys(error.keyPattern)
        let msgBody = uniqueKeys.map((key) => {
            return {
                [key]: key + " should be Unique"
            }
        })
        result = msgBody;
        message = "Validation Fail"
    }

    res.status(code).json({
        result: result,
        message: message,
        meta: null
    })
})

module.exports = app