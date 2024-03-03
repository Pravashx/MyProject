const router = require('express').Router()
const CheckLogin = require('../../middlewares/auth.middleware')
const CheckPermission = require('../../middlewares/rbac.middleware')
const uploader = require('../../middlewares/uploader.middleware')
const productCtrl = require('./product.controller')
const ValidateRequest = require("../../middlewares/validate-request-middleware")
const { ProductValidator } = require('./product.validator')
const productSvc = require('./product.service')

const dirsetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/product"
    next()
}

router.get('/home', productCtrl.listForHome)

router.get("/:slug/slug", productCtrl.getBySlug)

router.route('/')
    .post(
        CheckLogin,
        CheckPermission('admin'),
        dirsetup,
        uploader.array('images'),
        ValidateRequest(ProductValidator),
        productCtrl.createProduct
    )
     .get(
        CheckLogin,
        CheckPermission('admin'),
        productCtrl.listAllProduct
     )   

router.route('/:id')   
        .get(
            CheckLogin,
            CheckPermission('admin'),
            productCtrl.getById
        )
        .put(
            CheckLogin,
            CheckPermission('admin'),
            dirsetup,
            uploader.array('images'),
            ValidateRequest(ProductValidator),
            productCtrl.updateById
        )
        .delete(
            CheckLogin,
            CheckPermission('admin'),
            productCtrl.deleteById
        )

module.exports = router