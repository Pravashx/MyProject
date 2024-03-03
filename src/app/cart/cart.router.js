const CheckLogin = require('../../middlewares/auth.middleware')
const CheckPermission = require('../../middlewares/rbac.middleware')
const ValidateRequest = require('../../middlewares/validate-request-middleware')
const { CartValidator } = require('./cart.validator')
const cartCtrl = require('../cart/cart.controller')

const router = require('express').Router()

router.post('/add',
    CheckLogin,
    CheckPermission(['customer', 'admin']),
    ValidateRequest(CartValidator),
    cartCtrl.addToCart
)

router.get('/list',
    CheckLogin,
    CheckPermission(['customer', 'admin']),
    cartCtrl.listCart
)

router.get('/order/list',
    CheckLogin,
    CheckPermission(['customer', 'admin']),
    cartCtrl.listOrder
)

router.post(
    '/order',
    CheckLogin,
    CheckPermission(['customer', 'admin']),
    cartCtrl.createOrder
)

router.delete(
    '/:id/delete',
    CheckLogin,
    CheckPermission(['customer', 'admin']),
    cartCtrl.deleteItemFromCart
)

module.exports = router