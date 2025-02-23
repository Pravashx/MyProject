const productSvc = require("../product/product.service");
const cartSvc = require("./cart.service");
const CartRequest = require('./cart.request')
class CartController {

    addToCart = async (req, res, next) => {
        try {
            const { productId, qty } = req.body
            const product = await productSvc.getById({
                _id: productId
            })
            const buyer = req.authUser;

            const data = (new CartRequest()).transformCart(product, buyer, qty)

            let existingCart = await cartSvc.checkCart(productId, buyer._id)
            const update = await cartSvc.upsertCart(existingCart, data)
            res.json({
                result: update,
                message: "Product Added in the Cart.",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    listCart = async (req, res, next) => {
        try {
            let user = req.authUser
            let filter = { orderId: null }
            if (user.role !== 'admin') {
                filter = { ...filter, buyerId: user._id }
            }
            let detail = await cartSvc.getByFilter(filter)
            res.json({
                result: detail,
                message: "Your Cart",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    listOrder = async (req, res, next) => {
        try {
            let user = req.authUser
            let filter = { orderId: {$ne: null} }
            if (user.role !== 'admin') {
                filter = { ...filter, buyerId: user._id }
            }
            let detail = await cartSvc.getByFilter(filter)
            res.json({
                result: detail,
                message: "Your Cart",
                meta: null
            })
        } catch (exception) {
            next(exception)
        }
    }

    deleteItemFromCart = async (req, res, next) => {
        try {
            let id = req.params.id
            const cartDetail = await cartSvc.getById(id)
            if (!cartDetail) {
                throw { code: 400, message: "Cart does not exists" }
            }

            if (req.authUser.role === 'admin' || req.authUser._id === cartDetail.buyerId) {
                const deleted = await cartSvc.deleteCartById(id)
                res.json({
                    result: deleted,
                    message: "Cart Deleted Successfully",
                    meta: null
                })
            } else {
                throw { code: 403, message: "You are not allowed to delete other cart" }
            }
        } catch (exception) {
            next(exception)
        }
    }

    createOrder = async (req, res, next) => {
        try {
            const cartIds = req.body
            const filter = {
                _id: { $in: cartIds },
                orderId: null
            }

            const billNo = await cartSvc.getBillNo()
            const cart = await cartSvc.getByFilter(filter)

            if (cart.length === 0) {
                throw { code: 400, message: "Cart has already been placed for order." }
            }

            let subTotal = 0
            cart.map((item) => {
                subTotal += +item.amount
            })
            const discount = 0;
            const vatAmt = (subTotal - discount) * 0.13
            const deliveryCharge = 100

            const order = {
                billNo: billNo,
                buyer: req.authUser._id,
                subTotal: subTotal,
                discount: discount,
                vatAmt: vatAmt,
                deliveryCharge: deliveryCharge,
                amount: (subTotal - discount) + vatAmt + deliveryCharge,
                status: "new"
            }

            const { orderObj, cartUpdated } = await cartSvc.createOrder(order, cartIds)

            // Verification
            res.json({
                result: orderObj,
                message: "Order Placed Succssfully",
                meta: null
            })

        } catch (exception) {
            next(exception)
        }
    }
}

const cartCtrl = new CartController
module.exports = cartCtrl 