const dotenv = require('dotenv').config()
const { GenerateRandomString } = require('../../config/helper')
const authSvc = require('./auth.service')
const bcrypt = require('bcryptjs')
const mailSvc = require('../../services/mail.service')
const jwt = require('jsonwebtoken')
const { MongoClient } = require("mongodb")
const { dbSvc } = require("../../services/db.service")

class AuthController {
    register = async (req, res, next) => {
        try {
            let payload = req.body
            if (req.file) {
                payload.image = req.file.filename
            } else if (req.files) {
                payload.image = req.files.map((item) => item.filename)
            }
            payload.status = "inactive";
            payload.token = GenerateRandomString()

            // DB
            // let response = await dbSvc.db.collection('users').insertOne(payload)
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
            let userDetail = {
                _id: "1234",
                name: "Pravash Thakuri",
                email: "pravashotaku@gmail.com",
                phoneNum: "9849601141",
                role: "admin",
                status: "active",
                token: null,
                password: "$2a$10$qUtN997dSmX4U5iSadyP3urYKIU75JXZH5u.8U.M83QzRIx4MrkTy"
            }

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

                res.json({
                    token: token,
                    refreshToken: refreshToken,
                    type: "Bearer"
                })
            } else {
                next({ code: 400, message: "Credential does not match sir" })
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
}

const authCtrl = new AuthController()
module.exports = authCtrl