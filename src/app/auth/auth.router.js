const router = require('express').Router()
const authCtrl = require('../auth/auth.controller')
const uploader = require('../../middlewares/uploader.middleware')
const ValidateRequest = require('../../middlewares/validate-request-middleware')
const { registerSchema, passwordSchema } = require('./auth.validator')

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/user"
    next()
}

router.post('/register', dirSetup, uploader.single('image'), ValidateRequest(registerSchema) ,authCtrl.register)
router.get('/verify-token/:token',authCtrl.verifyToken)
router.post('/set-password/:token', ValidateRequest(passwordSchema), authCtrl.setPassword)
router.post('/login', (req, res, next) => { })
router.post('/forget-password', (req, res, next) => { })
router.get('/me', (req, res, next) => { })
router.post('/logout', (req, res, next) => { })


module.exports = router


