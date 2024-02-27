const BannerModel = require('./banner.model')
class BannerService {

    CollectPayload = (req) => {
        let data = {
            ...req.body,
        }
        if (!req.file) {
            throw { code: 400, message: "Image is required", result: data }
        } else {
            data.image = req.file.filename
        }
        data.createdBy = req.authUser._id
        return data
    }

    storeBanner = async (data) => {
        try {
            let banner = new BannerModel(data)
            return await banner.save()
        } catch (exception) {
            throw exception
        }
    }

    listAllData = async (filter = {}, paging = { offset: 0, limit: 15 }) => {
        try {
            let list = await BannerModel.find(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role'])
                .sort({ _id: 1 })
                .skip(paging.offset)
                .limit(paging.limit)
            return list;
        } catch (exception) {
            throw exception
        }
    }
    countData = async (filter = {}) => {
        try {
            let count = await BannerModel.countDocuments(filter)
            return count;
        } catch (exception) {
            throw exception
        }
    }
}

const bannerSvc = new BannerService
module.exports = bannerSvc