const express = require("express");
const router = express.Router();

const { chat } = require("../service/chatbot.s");
const auth = require("../middleware/auth.m");

router.post("/", auth, chat);
module.exports = router;
