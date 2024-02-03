const router = require('express').Router()
const authRouter = require('../app/auth/auth.router')

router.use(authRouter)

module.exports = router;