const { z } = require("zod");

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    age: z.number().positive()
});

module.exports = userSchema;