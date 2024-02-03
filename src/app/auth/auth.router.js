const router = require('express').Router()
const authCtrl = require('../auth/auth.controller')
const uploader = require('../../middlewares/uploader.middleware')
const ValidateRequest = require('../../middlewares/validate-request-middleware')
const { registerSchema } = require('./auth.validator')

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/user"
    next()
}

router.post('/register', dirSetup, uploader.single('image'), ValidateRequest(registerSchema) ,authCtrl.register)
router.post('/set-password/:token', (req, res, next) => { })
router.get('/verify-token/:token', (req, res, next) => { })
router.post('/set-password/:token', (req, res, next) => { })
router.post('/login', (req, res, next) => { })
router.post('/forget-password', (req, res, next) => { })
router.get('/me', (req, res, next) => { })
router.post('/logout', (req, res, next) => { })


module.exports = router


