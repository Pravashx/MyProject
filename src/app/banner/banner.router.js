const router = require("express").Router()

const CheckLogin = require("../../middlewares/auth.middleware")
const CheckPermission = require("../../middlewares/rbac.middleware")
const uploader = require("../../middlewares/uploader.middleware")
const ValidateRequest = require("../../middlewares/validate-request-middleware")
const bannerCtrl = require("./banner.controller")
const { BannerSchema } = require("./banner.validator")

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/banner"
    next()
}

router.get('/home', bannerCtrl.listHome)

router.route('/')
    .post(
        CheckLogin,
        CheckPermission("admin"),
        dirSetup,
        uploader.single("image"),
        ValidateRequest(BannerSchema),
        bannerCtrl.bannerCreate
    )
    .get(
        CheckLogin,
        CheckPermission("admin"),
        bannerCtrl.listAllBanners
    )

router.route('/:id')
        .get(
            CheckLogin,
            CheckPermission("admin"),
            bannerCtrl.getDataById
        )
        .put(
            CheckLogin,
            CheckPermission("admin"),
            dirSetup,
            uploader.single('image'),
            ValidateRequest(BannerSchema),
            bannerCtrl.updateById
        )
        .delete(
            CheckLogin,
            CheckPermission("admin"),
            bannerCtrl.deleteById
        )

module.exports = router