const { z } = require('zod')

const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phoneNum: z.string().min(10).max(10),
    role: z.string().regex(/admin|customer|seller/).default('customer'),
    status: z.string().regex(/active|inactive/).default('inactive')
})

const passwordSchema = z.object({
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and Confirm Password does not match",
    path: ["confirmPassword"]
})

module.exports = { registerSchema, passwordSchema }