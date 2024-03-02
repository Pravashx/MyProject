const { deleteFile } = require('../../config/helper')
const MenuModel = require('./menu.model')
const MenuRequest = require('./menu.request')
const menuSvc = require('./menu.service')

class MenuController {
    createMenu = async (req, res, next) => {
        try {
            let payload = (new MenuRequest(req)).createTransform()
            const menuList = await menuSvc.create(payload)

            res.json({
                result: menuList,
                message: "Menu Created Successfully",
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
            const count = await menuSvc.countData(filter)
            const data = await menuSvc.getData(filter, { limit, skip })

            console.log(data, count)
            res.json({
                result: data,
                message: "Menu List Fetched Succesfully",
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

    listAllMenu = async (req, res, next) => {
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
            const count = await menuSvc.countData(filter)
            const data = await menuSvc.getData(filter, { limit, skip })

            console.log(data, count)
            res.json({
                result: data,
                message: "Menu List Fetched Succesfully",
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
            let detail = await menuSvc.getBySlugWithProduct(filter)
            res.json({
                result: detail,
                message: "Menu Fetched Sucessfully",
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
            let detail = await menuSvc.getById(filter)
            res.json({
                result: detail,
                message: "Menu Fetched Sucessfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    updateById = async (req, res, next) => {
        try {
            const menu = req.content
            let payload = (new MenuRequest(req)).updateTransform(menu)
            const updated = await menuSvc.updateById(req.params.id, payload)

            if (payload.image && updated.image && updated.image !== payload.image) {
                deleteFile("./public/uploads/category", updated.image)
            }
            res.json({
                result: updated,
                message: "Menu updated",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    deleteById = async (req, res, next) => {
        try {
            let deleted = await menuSvc.deleteById(req.params.id)
            if (deleted.image) {
                deleteFile("./public/uploads/menu/", deleted.image)
            }
            res.json({
                result: deleted,
                message: "Menu Deleted successfully",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

}

const menuCtrl = new MenuController
module.exports = menuCtrl