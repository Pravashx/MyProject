const dotenv = require('dotenv')
dotenv.config()
const nodemailer = require('nodemailer')
const { GenerateRandomString } = require('../../config/helper')
const authSvc = require('./auth.service')

const mailSvc = require('../../services/mail.service')
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

            let mailMsg = authSvc.registerEmailMessage(payload.name, payload.token)
            const mailAck = await mailSvc.emailSend(
                payload.email,
                "Activate Your Account",
                mailMsg
            )

            res.json({
                result: payload
            })
        } catch (exception) {
            next(exception)
        }
    }

    verifyToken = async (req, res, next) => {
        try {
            let token = req.params.token
            if (token) {
                res.json({
                    result: {},
                    message: "Valid Token",
                    meta: null
                })
            } else {
                next({ code: 400, message: "Invalid Token or Token Expired" })
            }
        } catch (exception) {
            next(exception)
        }
    }

    async setPassword(req, res, next) {
        try {
            let data = req.body;
            console.log(data)
            res.json({
                result: data
            })
        } catch (exception) {
            next(exception)
        }
    }
}

const authCtrl = new AuthController()
module.exports = authCtrl