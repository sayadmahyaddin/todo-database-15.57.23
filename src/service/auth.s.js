const usersM = require("../models/users.m.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./email.s.js");

async function register(req, res) {
  try {
    const { name, email, password, age } = req.body;

    const exuser = await usersM.findOne({ email });

    if (exuser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const hashpass = await bcrypt.hash(password, 12);

    await usersM.create({
      name,
      email,
      password: hashpass,
      age,
      verificationCode,
      isVerified: false,
    });

    await sendEmail(
      email,
      "Daylist verification",
      `Your verification code is: ${verificationCode}`,
    );

    return res.status(201).json({
      message: "Registration successful. Check your email.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;

    const user = await usersM.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await usersM.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const user = await usersM.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  login,
  register,
  me,
  verifyEmail,
};
