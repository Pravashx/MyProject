require('dotenv').config()
const jwt = require('jsonwebtoken')

const CheckLogin = (req, res, next) => {
    try {
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
        //

        if (token === null) {
            next({ code: 401, message: "Login required" })
        } else {
            token = (token.split(" ")).pop()
            if (!token) {
                next({ code: 401, message: "Token required" })
            } else {
                let data = jwt.verify(token, process.env.JWT_SECRET)
                console.log(data)
                let userDetail = {
                    _id: "1234",
                    name: "Pravash Thakuri",
                    email: "pravashotaku@gmail.com",
                    phoneNum: "9849601141",
                    role: "admin",
                    status: "active",
                    token: null
                }
                if(userDetail){
                    req.authUser = userDetail
                    next()
                }else{
                    next({code: 403, message: "User does not exists"})
                }
            }
        }

    } catch (exception) {
        console.log(exception)
        next({ code: 403, message: "Authentication Failed" })
    }
}

module.exports = CheckLogin