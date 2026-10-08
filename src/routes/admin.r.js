const express = require("express");
const {
  getAllUsersWithTodos,
  createUser,
  updatedUser,
  deleteUser,
} = require("../services/admin.s");

const router = express.Router();

// getusers, updateauser, deleteusers, create user*, gettodos, deletetodos

router.get("/getUsers", getAllUsersWithTodos);
router.post("/createUser", createUser);
router.patch("/updatedUser", updatedUser);
router.delete("/deleteUser/:id", deleteUser);
module.exports = router;
