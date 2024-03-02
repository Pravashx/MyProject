require('dotenv').config()
const authSvc = require('./auth.service')
const bcrypt = require('bcryptjs')
const mailSvc = require('../../services/mail.service')
const jwt = require('jsonwebtoken')
const { AuthRequest } = require('./auth.request')
const { getTokenFromHeader, GenerateRandomString } = require('../../config/helper')

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

            let userDetail = await authSvc.getuserByFilter({
                token: token
            });

            if (userDetail) {
                res.json({
                    result: userDetail,
                    msg: "Token verified",
                    meta: null
                })
            } else {
                next({ code: 400, message: "Token does not exists", result: { token } })
            }
        } catch (except) {
            next(except)
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
                            result: {
                                token: token,
                                refreshToken: refreshToken,
                                type: "Bearer "
                            }
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

    logout = async (req, res, next) => {
        try {
            let token = getTokenFromHeader(req)
            let loggedout = await authSvc.deletePatData(token)
            res.json({
                result: loggedout,
                message: "Logged out successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    forgetPassword = async (req, res, next) => {
        try {
            const body = req.body
            const userDetail = await authSvc.getuserByFilter({
                email: body.email
            })

            let token = GenerateRandomString(100)
            let expiry = Date.now() + 86400000

            if (userDetail.status === "active") {
                let updateData = {
                    resetToken: token,
                    resetExpiry: expiry
                }
                let update = await authSvc.updateUser({
                    _id: userDetail._id
                }, updateData)
                let message = await authSvc.forgetPasswordMessage(userDetail.name, token)
                await mailSvc.emailSend(userDetail.email, "Reset Password...", message)
                res.json({
                    result: null,
                    message: "Check your email for the further processing",
                    meta: null
                })
            } else {
                next({ code: 400, message: "User not activated" })
            }
        } catch (exception) {
            next(exception)
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            let payload = req.body
            let token = req.params.resetToken

            let userDetail = await authSvc.getuserByFilter({
                token: payload.resetToken
            })
            if (!userDetail) {
                throw { code: 400, message: "Token not founds" }
            } else {
                let todays = new Date()
                if (todays > userDetail.resetExpiry) {
                    throw { code: 400, message: "Token Expired" }
                } else {
                    let updateData = {
                        password: bcrypt.hashSync(payload.password, 10),
                        resetExpiry: null,
                        resetToken: null
                    }
                    await authSvc.updateUser({
                        _id: userDetail._id
                    }, updateData)

                    res.json({
                        result: null,
                        message: "Your Password has been changed sucessfully. Please Login to continue",
                        meta: null
                    })
                }
            }
        } catch (exception) {
            next(exception)
        }
    }
}

const authCtrl = new AuthController()
module.exports = authCtrl




