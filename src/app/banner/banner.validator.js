const { z } = require("zod");

const BannerSchema = z.object({
    title: z.string().min(3),
    url: z.string().url().nullable(),
    status: z.string().regex(/active|inactive/)
})

module.exports = {
    BannerSchema
}