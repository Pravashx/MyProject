const { default: slugify } = require("slugify");

class MenuRequest {
    data;
    file;
    user;
    constructor(req) {
        this.data = req.body;
        this.file = req.file;
        this.user = req.authUser
    }
    createTransform = () => {
        let payload = {
            ...this.data
        }
        if (this.file) {
            payload.image = this.file.filename
        } else {
            payload.image = null
        }
        payload.slug = slugify(this.data.title, { lower: true })
        if (!this.data.parentId || this.data.parentId === 'null' || this.data.parentId === '') {
            payload.parentId = null
        }
        payload.createdBy = this.user._id
        return payload
    }

    updateTransform = (menu) => {
        let payload = {
            ...this.data
        }
        if (this.file) {
            payload.image = this.file.filename
        } else {
            payload.image = menu.image
        }

        if (!this.data.parentId || this.data.parentId === 'null' || this.data.parentId === '') {
            payload.parentId = null
        }

        return payload
    }
}

module.exports = MenuRequest