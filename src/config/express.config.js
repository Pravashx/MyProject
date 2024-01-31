const router = require('../router/index')
const express = require('express')
const app = express()

// Body Parser
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

app.use('/health', (req, res) => {
    res.send("Success >.<")
})
app.use('/v1', router)

// 404 Error Handle
app.use((req, res, next) => {
    res.status(404).json({
        result: null,
        message: "Not Found",
        meta: null
    })
})

// TODO: Handle Different Types Of Exception
app.use((error, req, res, next) => {
    console.log("GarbageCollector: ", error)
    let code = error.code ?? 500
    let message = error.message ?? "Internal Server Error"

    res.status(code).json({
        result: null,
        message: message,
        meta: null
    })
})

module.exports = app;



