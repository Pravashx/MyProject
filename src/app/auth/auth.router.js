const router = require('express').Router()

router.post('/register', (req, res, next) => {
    try {
        let payload = req.body
        res.json({
            result: payload
        })
    } catch (exception) {
        next({ code: 400, message: "Validation Failure" })
    }
})
router.get('verify-token/:token', (req, res, next) => { })
router.post('/set-password/:token', (req, res, next) => { })

router.post('/login', (req, res, next) => { })

router.post('forget-password', (req, res, next) => { u })
router.get('/me', (req, res, next) => { })
router.post('/logout', (req, res, next) => { })

module.exports = router
