const { deleteFile } = require('../../config/helper')
const ProductModel = require('./product.model')
const ProductRequest = require('./product.request')
const productSvc = require('./product.service')

class ProductController {
    createProduct = async (req, res, next) => {
        try {
            let payload = (new ProductRequest(req)).createTransform()
            payload.slug = await productSvc.checkSlug(payload.slug)
            const productList = await productSvc.create(payload)

            res.json({
                result: productList,
                message: "Product Created Successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    listForHome = async (req, res, next) => {
        try {
            let filter = {}
            if (req.query.search) {
                filter = {
                    $or: [
                        { title: new RegExp(req.query.search, 'i') },
                        { description: new RegExp(req.query.search, 'i') }
                    ]
                }
            }
            filter = {
                $and: [
                    { ...filter },
                    { status: "active" }
                ]
            }
            console.log(filter)
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 15;
            const skip = (page - 1) * limit;
            const count = await productSvc.countData(filter)
            const data = await productSvc.getData(filter, { limit, skip })

            console.log(data, count)
            res.json({
                result: data,
                message: "Product List Fetched Succesfully",
                meta: {
                    page: page,
                    total: count,
                    limit: limit
                }
            })
        } catch (exception) {
            next(exception)
        }
    }

    listAllProduct = async (req, res, next) => {
        try {
            let filter = {}
            if (req.query.search) {
                filter = {
                    $or: [
                        { title: new RegExp(req.query.search, 'i') },
                        { description: new RegExp(req.query.search, 'i') }
                    ]
                }
            }
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 15;
            const skip = (page - 1) * limit;
            const count = await productSvc.countData(filter)
            const data = await productSvc.getData(filter, { limit, skip })

            console.log(data, count)
            res.json({
                result: data,
                message: "Product List Fetched Succesfully",
                meta: {
                    page: page,
                    total: count,
                    limit: limit
                }
            })
        } catch (exception) {
            next(exception)
        }
    }

    getBySlug = async (req, res, next) => {
        try {
            let filter = {
                slug: req.params.slug,
                status: "active"
            }
            let detail = await productSvc.getBySlugWithProduct(filter)
            res.json({
                result: detail,
                message: "Product Fetched Sucessfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    getById = async (req, res, next) => {
        try {
            let filter = {
                _id: req.params.id
            }
            let detail = await productSvc.getById(filter)
            res.json({
                result: detail,
                message: "Product Fetched Sucessfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    updateById = async (req, res, next) => {
        try {
            let id = req.params.id
            let data = await productSvc.getById({ _id: id })
            if (!data) {
                throw { code: 404, message: "Content does not exists" }
            } else {
                req.content = data
            }

            const product = req.content;
            const payload = (new ProductRequest(req)).updateTransform(product)
            const updated = await productSvc.updateById(req.params.id, payload);


            res.json({
                result: updated,
                message: "Product Updated",
                meta: null
            })

        } catch (exception) {
            next(exception)
        }

    }

    deleteById = async (req, res, next) => {
        try {
            let id = req.params.id
            let data = await productSvc.getById({ _id: id })
            if (!data) {
                throw { code: 404, message: "Content does not exists" }
            }

            let deleted = await productSvc.deleteById(req.params.id)
            if (deleted.image) {
                deleteFile("./public/uploads/product/", deleted.image)
            }
            res.json({
                result: deleted,
                message: "Product Deleted successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

}

const productCtrl = new ProductController
module.exports = productCtrl