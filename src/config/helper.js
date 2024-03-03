const fs = require('fs')
const GenerateRandomString = (len = 100) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ"
    let lengths = chars.length;
    let random = ""

    for (let i = 0; i <= len; i++) {
        let posn = generateRandomNumber(lengths - 1)
        random += chars[posn]
    }
    return random
}

const GenerateRandomNumber = (limit, lower = 0) => {
    let posn = Math.ceil(lower + (Math.random() * limit))
    return posn
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
    if (filename && fs.existsSync(path + filename)) {
        fs.unlinkSync(path + filename)
    }
}
module.exports = { GenerateRandomString, getTokenFromHeader, deleteFile, GenerateRandomNumber }