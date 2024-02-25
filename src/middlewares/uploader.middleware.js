const multer = require('multer')
const fs = require('fs')

const MyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = req.uploadDir ?? "./public/uploads/user"
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
        cb(null, path)
    },
    filename: (req, file, cb) => {
        let random = (Math.round(Math.random() * 9999))
        let ext = (file.originalname.split('.')).pop()
        let FileName = Date.now() + "-" + random + "." + ext
        cb(null, FileName)
    }
})
const ImageFilter = (req, file, cb) => {
    let ext = (file.originalname.split('.')).pop()
    let allowed = ['jpeg', 'png', 'jpg', 'svg', 'gif', 'webp']
    if (allowed.includes(ext.toLowerCase())) {
        cb(null, true)
    } else {
        cb({ code: 400, message: "Image Format not Supported" })
    }
}
const uploader = multer({
    storage: MyStorage,
    fileFilter: ImageFilter,
    limits: {
        fileSize: 3000000
    }
})

module.exports = uploader