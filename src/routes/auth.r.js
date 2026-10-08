const express = require("express");
const { register, login, me, verifyEmail } = require("../service/auth.s");
const auth = require("../middleware/auth.m");
const validation = require("../middleware/validation.m");

const userSchema = require("../schema/auth.schema");

const router = express.Router();

router.post("/register", validation(userSchema), register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/verify", verifyEmail);

module.exports = router;
