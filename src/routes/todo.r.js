const express = require("express");
const { createTodo, getTodos } = require("../service/todo.s");
const router = express.Router();
const Todo = require("../models/todo.m");

router.post("/todos", createTodo); 
router.get("/todos", getTodos); 

module.exports = router;
