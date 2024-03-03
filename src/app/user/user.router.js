const router = require('express').Router()
const CheckLogin = require('../../middlewares/auth.middleware')
const CheckPermission = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const userCtrl = require('./user.controller')
const ValidateRequest = require("../../middlewares/validate-request-middleware")
const { UserValidator } = require('./user.validator')
const CheckAccess = require('../../middlewares/access-check.middleware')
const userSvc = require('./user.service')

const dirsetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/user"
    next()
}

router.get('/home', userCtrl.listForHome)

router.get("/:slug/slug", userCtrl.getBySlug)

router.route('/')
    .post(
        CheckLogin,
        CheckPermission('admin'),
        dirsetup,
        uploader.array('images'),
        ValidateRequest(UserValidator),
        userCtrl.createUser
    )
     .get(
        CheckLogin,
        CheckPermission('admin'),
        userCtrl.listAllUser
     )   

router.route('/:id')   
        .get(
            CheckLogin,
            CheckPermission('admin'),
            userCtrl.getById
        )
        .put(
            CheckLogin,
            CheckPermission('admin'),
            CheckAccess(userSvc),
            dirsetup,
            uploader.single('image'),
            ValidateRequest(UserValidator),
            userCtrl.updateById
        )
        .delete(
            CheckLogin,
            CheckPermission('admin'),
            CheckAccess(userSvc),
            userCtrl.deleteById
        )

module.exports = router