const router = require('express').Router()
const authRouter = require('../app/auth/auth.router')
const bannerRouter = require('../app/banner/banner.router')
const menuRouter = require('../app/menu/menu.router')
const productRouter = require('../app/product/product.router')

router.use(authRouter)
router.use('/banner', bannerRouter)
router.use('/menu', menuRouter)
router.use('/product', productRouter)

module.exports = router;