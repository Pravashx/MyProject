const { default: slugify } = require("slugify");

class ProductRequest {
    data;
    files;
    user;
    constructor(req) {
        this.data = req.body;
        this.files = req.files;
        this.user = req.authUser
    }
    createTransform = () => {
        let payload = {
            ...this.data
        }
        if (this.files) {
            payload.images = this.files.map((item)=> item.filename)
        } else {
            payload.images = null
        }

        if (payload.menu && payload.menu !== 'null') {
            payload.menu = payload.menu.split(',')
        } else {
            payload.menu = null
        }

        payload.afterDiscount = payload.price - payload.price * payload.discount / 100
        payload.slug = slugify(this.data.title, { lower: true })

        payload.createdBy = this.user._id
        return payload
    }

    updateTransform = (product) => {
        let payload = {
            ...this.data
        }
        if (this.files) {
            payload.images = this.files.map((item)=> item.filename)
        } 
        payload.images = [...payload.images, ...product.images]

        if(payload.delImages){
            let images = payload.images.filter((img)=> !payload.delImages.includes(img))
            payload.images = images
        }

        if (payload.menu && payload.menu !== 'null') {
            payload.menu = payload.menu.split(',')
        }

        payload.afterDiscount = payload.price - payload.price * payload.discount / 100
        return payload
    }
}

module.exports = ProductRequest