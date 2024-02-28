const fs = require('fs')
const GenerateRandomString = (len = 100) => {
    const chars = "1234567890abcdefghijklmnopqrstuvwxzABCDEFGHIJKLMNOPQRSTUVWXZ"
    let length = chars.length
    random = ""
    for (let i = 1; i <= len; i++) {
        let psn = Math.ceil(Math.random() * (length - 1))
        random += chars[psn]
    }
    return random
}

const getTokenFromHeader = (req) => {
    let token = null

    if (req.headers['authorization']) {
        token = req.headers['authorization']
    }
    if (req.headers['x-xsrf-token']) {
        token = req.headers['x-xsrf-token']
    }
    if (req.query['token']) {
        token = req.query['token']
    }
    return token
}

deleteFile = (path, filename) => {
    if (filename && fs.existsSync(path+filename)) {
        fs.unlinkSync(path+filename)
    }
}
module.exports = { GenerateRandomString, getTokenFromHeader, deleteFile }