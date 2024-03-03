const { GenerateRandomNumber } = require("../../config/helper")
const ProductModel = require("./product.model")

class ProductService {

    create = async (payload) => {
        try {
            const create = ProductModel(payload)
            return await create.save()
        } catch (exception) {
            throw exception
        }
    }

    checkSlug = async(slug) =>{
        try{
            let count = await ProductModel.countDocuments({slug: slug})
            if(count>0){
                let random = GenerateRandomNumber(1000)
                slug = slug+'-' + random;
                return await this.checkSlug(slug)
            }else{
                return slug
            }
        }catch(exception){
            throw exception
        }
    }

    countData = async (filter) => {
        try {
            const count = await ProductModel.countDocuments(filter)
            return count;
        } catch (exception) {
            throw exception
        }
    }

    getData = async (filter, { limit = 15, skip = 0 }) => {
        try {
            let data = await ProductModel.find(filter)
                .populate("menu", ['_id', 'title', 'slug', 'status'])
                .sort({ _id: "desc" })
                .skip(skip)
                .limit(limit)
            return data;
        } catch (exception) {
            throw exception
        }
    }

    getBySlugWithProduct = async (filter) => {
        try {
            const pipeline = [
                {
                    '$match': {
                        ...filter
                    }
                },
                {
                    '$lookup': {
                        'from': 'users',
                        'localField': 'createdBy',
                        'foreignField': '_id',
                        'as': 'createdBy'
                    }
                }, {
                    '$lookup': {
                        'from': 'products',
                        'localField': 'parentId',
                        'foreignField': '_id',
                        'as': 'parentId'
                    }
                }, {
                    '$unwind': {
                        'path': '$parentId',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    '$unwind': {
                        'path': '$createdBy',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    '$project': {
                        '_id': '$_id',
                        'title': '$title',
                        'description': '$description',
                        'slug': '$slug',
                        'status': '$status',
                        'parentId': '$parentId',
                        'image': '$image',
                        'createdAt': '$createdAt',
                        'updatedAt': '$updatedAt',
                        'createdBy': {
                            '_id': '$createdBy._id',
                            'name': '$createdBy.name'
                        }
                    }
                }
            ]
            let data = await ProductModel.aggregate(pipeline)
            if (!data) {
                throw { code: 404, message: "Product does not exists" }
            }
            return data
        } catch (exception) {
            throw exception
        }
    }

    getById = async (filter) => {
        try {
            let data = await ProductModel.findOne(filter)
                .populate("menu", ['_id', 'title', 'slug', 'status'])
            if (!data) {
                throw { code: 404, message: "Product does not exists" }
            }
            return data
        } catch (exception) {
            throw exception
        }
    }

    updateById = async(id, data) =>{
        try {
            const update = await ProductModel.findByIdAndUpdate(id, {$set: data});
            return update;
        } catch(exception) {
            throw exception
        }
    }

    deleteById = async (id) => {
        try {
            let deleted = await ProductModel.findByIdAndDelete(id)
            if (deleted) {
                return deleted
            } else {
                throw { code: 404, message: "Product does not exists" }
            }
        } catch (exception) {
            throw exception
        }
    }
}

const productSvc = new ProductService
module.exports = productSvc