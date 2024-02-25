const router = require('express').Router()
const authCtrl = require('../auth/auth.controller')
const uploader = require('../../middlewares/uploader.middleware')
const ValidateRequest = require('../../middlewares/validate-request-middleware')
const { registerSchema, passwordSchema, loginSchema } = require('./auth.validator')
const CheckLogin = require('../../middlewares/auth.middleware')
const CheckPermission = require('../../middlewares/rbac.middleware')

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/user"
    next()
}

router.post('/register', dirSetup, uploader.single('image'), ValidateRequest(registerSchema), authCtrl.register)
router.get('/verify-token/:token', authCtrl.verifyToken)
router.post('/set-password/:token', ValidateRequest(passwordSchema), authCtrl.setPassword)

router.post('/login', ValidateRequest(loginSchema), authCtrl.login)

router.get('/me', CheckLogin, authCtrl.getLoggedInUser)
router.get('/admin', CheckLogin, CheckPermission('admin'), (req, res, next)=>{
    res.json("I'm Admin Lil Bro")
})
router.get('/admin-seller', CheckLogin, CheckPermission(['admin', 'seller']), (req, res, next)=>{
    res.json("I'm Called by Admin and Seller")
})

router.post('/refresh-token')

router.get('/forget-password', (req, res, next) => { })
router.post('/logout', (req, res, next) => { })


module.exports = router


