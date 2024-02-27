const router = require("express").Router()

const CheckLogin = require("../../middlewares/auth.middleware")
const CheckPermission = require("../../middlewares/rbac.middleware")
const uploader = require("../../middlewares/uploader.middleware")
const ValidateRequest = require("../../middlewares/validate-request-middleware")
const bannerCtrl = require("./banner.controller")
const { BannerCreateSchema } = require("./banner.validator")

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/banner"
    next()
}

router.route('/')
    .post(
        CheckLogin,
        CheckPermission("admin"),
        dirSetup,
        uploader.single("image"),
        ValidateRequest(BannerCreateSchema),
        bannerCtrl.bannerCreate
    )
    .get(
        CheckLogin,
        CheckPermission("admin"),
        bannerCtrl.listAllBanners
    )

module.exports = router