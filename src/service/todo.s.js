const Todo = require("../models/todo.m");

async function createTodo(req, res) {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.create({
      title,
      completed,
      user: req.user.id,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
async function getTodos(req, res) {
  try {
    const todos = await Todo.find({ user: req.user.id });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {createTodo,getTodos};
