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
    CollectEditPayload = (req) => {
        let data = {
            ...req.body,
        }
        if (req.file && req.file !== undefined) {
            data.image = req.file.filename
        }
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

    listAllData = async (filter = {}, paging = { offset: skip, limit: 15 }, options = { sort: { _id: 1 } }) => {
        try {
            let list = await BannerModel.find(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role', 'image'])
                .sort(options.sort)
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

    getById = async (filter) => {
        try {
            let data = await BannerModel.findOne(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'role', 'image'])
            if (data) {
                return data
            } else {
                throw { code: 404, message: "Banner does not exists" }
            }
        } catch (exception) {
            throw exception
        }
    }
    updateById = async (bannerId, payload) => {
        try {
            let response = await BannerModel.findByIdAndUpdate(bannerId,
                { $set: payload })
                return response
        } catch (exception) {
            throw exception
        }
    }
    deleteById = async(bannerId)=>{
        try{
            let response = await BannerModel.findByIdAndDelete(bannerId)
            if(response){
                return response
            }else{
                throw{code: 404, message: "Banner already deleted or does not exists"}
            }
        }catch(exception){
            throw exception
        }
    }
}

const bannerSvc = new BannerService
module.exports = bannerSvc