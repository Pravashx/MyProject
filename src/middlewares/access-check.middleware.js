const menuSvc = require("../app/menu/menu.service")

const CheckAccess = (svc) => {
    return async (req, res, next) => {
        try {
            let id = req.params.id
            let data = await menuSvc.getById({
                _id: id
            })
            if (!data) {
                throw { code: 404, message: "Content does not exists" }
            } else if (!data.createdBy._id.equals(req.authUser._id)) {
                throw { code: 403, message: "Content does not belongs to you" }
            } else {
                req.content = data
                next()
            }
        } catch (exception) {

        }
    }
}

module.exports = CheckAccess