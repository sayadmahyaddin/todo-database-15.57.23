const express = require("express");
const router = express.Router();

const { sendEmail } = require("../service/email.s");

router.post("/send", sendEmail);

module.exports = router;
›