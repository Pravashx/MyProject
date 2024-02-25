require('dotenv').config()
const authSvc = require('./auth.service')
const bcrypt = require('bcryptjs')
const mailSvc = require('../../services/mail.service')
const jwt = require('jsonwebtoken')
const { AuthRequest } = require('./auth.request')

class AuthController {

    register = async (req, res, next) => {
        try {
            let payload = (new AuthRequest(req)).transformRequestData()
            // DBs
            let response = await authSvc.registerUser(payload)

            let mailMsg = authSvc.registerEmailMessage(payload.name, payload.token)
            const mailAck = await mailSvc.emailSend(
                payload.email,
                "Activate Your Account",
                mailMsg
            )

            res.json({
                result: response,
                message: "User registered successfully.",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    verifyToken = async (req, res, next) => {
        try {
            let token = req.params.token;

            // query 
            let userDetail = await authSvc.getuserByFilter({
                token: token
            });

            if (userDetail) {
                res.json({
                    result: userDetail,
                    msg: "token verified",
                    meta: null
                })
            } else {
                next({ code: 400, message: "Token does not exists", result: { token } })
            }
        } catch (excep) {
            next(excep)
        }
    }

    async setPassword(req, res, next) {
        try {
            let data = req.body
            let token = req.params.token
            let userDetail = await authSvc.getuserByFilter({
                token: token
            })

            if (userDetail) {
                let encPass = bcrypt.hashSync(data.password, 10)

                const updateData = {
                    password: encPass,
                    token: null,
                    status: "active"
                }
                let updateResponse = await authSvc.updateUser({ token: token }, updateData)

                res.json({
                    result: updateResponse,
                    message: "User Activated successfully",
                    meta: null
                })
            } else {
                next({ code: 400, message: "User does not exists/ token expired/broken", result: data })
            }

        } catch (exception) {
            next(exception)
        }
    }

    async login(req, res, next) {
        try {
            let credentials = req.body;

            let userDetail = await authSvc.getuserByFilter({
                email: credentials.email
            })

            if (userDetail) {
                if (userDetail.token === null && userDetail.status === 'active') {
                    if (bcrypt.compareSync(credentials.password, userDetail.password)) {
                        let token = jwt.sign({
                            userId: userDetail._id
                        }, process.env.JWT_SECRET, {
                            expiresIn: "1h"
                        })

                        let refreshToken = jwt.sign({
                            userId: userDetail._id
                        }, process.env.JWT_SECRET, {
                            expiresIn: "1d"
                        })

                        let patData = {
                            userId: userDetail._id,
                            token: token,
                            refreshToken: refreshToken
                        }
                        await authSvc.storePAT(patData)

                        res.json({
                            token: token,
                            refreshToken: refreshToken,
                            type: "Bearer"
                        })
                    } else {
                        next({ code: 400, message: "Credential does not match sir" })
                    }
                } else {
                    next({ code: 401, messsage: "User not activated. Check your email for activation link." })
                }
            } else {
                next({ code: 400, message: "User does not exists." })
            }
        } catch (exception) {
            next(exception)
        }
    }

    async getLoggedInUser(req, res, next) {
        res.json({
            result: req.authUser
        })
    }
    
    logout = async (req, res, next)=>{
        try{
            let user = req.authUser
            let loggedout = await authSvc.deletePatData(user._id)
        }catch(exception){
            next(exception)
        }
    }
}

const authCtrl = new AuthController()
module.exports = authCtrl




