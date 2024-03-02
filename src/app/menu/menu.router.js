const router = require('express').Router()
const CheckLogin = require('../../middlewares/auth.middleware')
const CheckPermission = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const menuCtrl = require('./menu.controller')
const ValidateRequest = require("../../middlewares/validate-request-middleware")
const { MenuValidator } = require('./menu.validator')
const CheckAccess = require('../../middlewares/access-check.middleware')
const menuSvc = require('./menu.service')

const dirsetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/menu"
    next()
}

router.get('/home', menuCtrl.listForHome)

router.get("/:slug/slug", menuCtrl.getBySlug)

router.route('/')
    .post(
        CheckLogin,
        CheckPermission('admin'),
        dirsetup,
        uploader.single('image'),
        ValidateRequest(MenuValidator),
        menuCtrl.createMenu
    )
     .get(
        CheckLogin,
        CheckPermission('admin'),
        menuCtrl.listAllMenu
     )   

router.route('/:id')   
        .get(
            CheckLogin,
            CheckPermission('admin'),
            menuCtrl.getById
        )
        .put(
            CheckLogin,
            CheckPermission('admin'),
            CheckAccess(menuSvc),
            dirsetup,
            uploader.single('image'),
            ValidateRequest(MenuValidator),
            menuCtrl.updateById
        )
        .delete(
            CheckLogin,
            CheckPermission('admin'),
            CheckAccess(menuSvc),
            menuCtrl.deleteById
        )

module.exports = router