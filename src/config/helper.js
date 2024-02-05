const GenerateRandomString =(len = 100)=>{
    const chars = "1234567890abcdefghijklmnopqrstuvwxzABCDEFGHIJKLMNOPQRSTUVWXZ"
    let length = chars.length
    random = ""
    for(let i = 1; i <= len; i++){
        let psn = Math.ceil(Math.random() * (length-1))
        random+= chars[psn]
    }
    return random
}

module.exports = {GenerateRandomString}