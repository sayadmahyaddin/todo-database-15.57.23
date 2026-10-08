const express = require("express");
const cors = require("cors");
const connect = require("./src/db/db");
const auth = require("./src/middleware/auth.m");
const chatbotRoutes = require("./src/routes/chatbot.r");
require("dotenv").config();


const authRouter = require("./src/routes/auth.r");
const todoRouter = require("./src/routes/todo.r");
const emailRouter = require("./src/routes/email.r")

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());



app.use("/auth", authRouter);
app.use("/todo", auth, todoRouter);
app.use("/api/chatbot", chatbotRoutes);
app.use("/email", emailRouter)

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy", date: new Date() });
});

connect();

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
