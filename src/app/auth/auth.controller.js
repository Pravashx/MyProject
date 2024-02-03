class AuthController {
    register = (req, res, next) => {
        try {
            let payload = req.body
            if (req.file) {
                payload.image = req.file.filename
            } else if (req.files) {
                payload.image = req.files.map((item) => item.filename)
            }
            res.json({
               result: payload
            })
        } catch (exception) {
            next(exception)
        }
    }
}

const authCtrl = new AuthController()
module.exports = authCtrl