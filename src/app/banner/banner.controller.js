const bannerSvc = require('./banner.service')

class BannerController {
    bannerCreate = async (req, res, next) => {
        try {
            const payload = bannerSvc.CollectPayload(req)
            const created = await bannerSvc.storeBanner(payload)
            res.json({
                result: created,
                message: "Banner Created Succesfully.",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    listAllBanners = async (req, res, next) => {
        try {
            let filter = {}
            if (req.query['search']) {
                filter = {
                    $or: [
                        { title: new RegExp(req.query['search'], 'i') },
                        { url: new RegExp(req.query['search'], 'i') },
                        { status: new RegExp(req.query['search'], 'i') }
                    ]
                }
            }

            filter = {
                $and: [
                    { createdBy: req.authUser._id },
                    { ...filter }
                ]
            }

            let page = req.query['page'] || 1;
            let limit = req.query['limit'] || 15;

            let total = await bannerSvc.countData(filter)
            let skip = (page - 1) * limit

            let list = await bannerSvc.listAllData(filter, { offset: skip, limit: limit })
            res.json({
                result: list,
                message: "Banner Fetched Sucessfully",
                meta: {
                    total: total,
                    currentPage: page,
                    limit: limit
                }
            })

        } catch (exception) {
            next(exception)
        }
    }


}

const bannerCtrl = new BannerController
module.exports = bannerCtrl