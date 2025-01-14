const { z } = require('zod')

const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(10).max(10),
    role: z.string().regex(/admin|customer/).default('customer'),
    status: z.string().regex(/active|inactive/).default('inactive')
})

const emailValidation = z.object({
    email: z.string().email()
})

const passwordSchema = z.object({
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,20}$/),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm Password does not match",
    path: ["confirmPassword"]
})

const loginSchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(8)
})

module.exports = { registerSchema, passwordSchema, loginSchema, emailValidation }