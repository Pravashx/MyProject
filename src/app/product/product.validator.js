const { z } = require('zod')

const ProductValidator = z.object({
    title: z.string().min(3),
    description: z.string().nullable(),
    menu: z.string().nullable(),
    price: z.string().regex(/^\d+$/).min(1),
    discount: z.string().regex(/^\d+$/).min(0).max(99).nullable(),
    attributes: z.array(z.object({
        key: z.string(),
        value: z.array(z.string())
    })).nullable()
})

module.exports = { ProductValidator }