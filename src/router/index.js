const router = require('express').Router()
const authRouter = require('../app/auth/auth.router')
const bannerRouter = require('../app/banner/banner.router')
const menuRouter = require('../app/menu/menu.router')

router.use(authRouter)
router.use('/banner', bannerRouter)
router.use('/menu', menuRouter)

module.exports = router;