require('dotenv').config()
const jwt = require('jsonwebtoken')
const authSvc = require('../app/auth/auth.service')
const { getTokenFromHeader } = require('../config/helper')

const CheckLogin = async (req, res, next) => {
    try {
        
        let token = getTokenFromHeader(req);

        if (token === null) {
            next({ code: 401, message: "Login required" })
        } else {
            token = (token.split(" ")).pop()
            if (!token) {
                next({ code: 401, message: "Token required" })
            } else {
                let patData = await authSvc.getPatByToken(token)
                if (patData) {
                    let data = jwt.verify(token, process.env.JWT_SECRET)

                    let userDetail = await authSvc.getuserByFilter({
                        _id: data.userId
                    })

                    if (userDetail) {
                        req.authUser = userDetail
                        next()
                    } else {
                        next({ code: 401, message: "User does not exists" })
                    }
                } else {
                    nexxt({ code: 401, message: "Token already expired or invalid" })
                }
            }
        }

    } catch (exception) {
        next({ code: 403, message: "Authentication Failed" })
    }
}

module.exports = CheckLogin




