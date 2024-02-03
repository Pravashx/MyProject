const {z} = require('zod')

const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email:z.string().email(),
    phoneNum: z.string().min(10).max(10),
    role: z.string().regex(/admin|customer|seller/).default('customer'),
    status: z.string().regex(/active|inactive/).default('inactive')
})

module.exports = {registerSchema}