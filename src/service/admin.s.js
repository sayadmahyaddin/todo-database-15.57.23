const { success } = require("zod");
const usersM = require("../models/users.m");
const bcrypt = require("bcrypt");
/**
 * Bütün istifadəçiləri və query parametrinə əsasən onların todolarını gətirir.
 * Nümunə sorğular:
 *   GET /api/admin/users
 *   GET /api/admin/users?iscomplite=true
 *   GET /api/admin/users?iscomplite=false&search=kitab
 */
async function getAllUsersWithTodos(req, res) {
  try {
    const { iscomplite, search } = req.query;

    const todoMatch = {};

    if (iscomplite !== undefined) {
      todoMatch.iscomplite = iscomplite === "true";
    }

    if (search) {
      todoMatch.todo = { $regex: search, $options: "i" };
    }

    const users = await usersM
      .find()
      .select("-password") // Təhlükəsizlik üçün şifrə sahəsini gizlədir
      .populate({
        path: "todos",
        match: todoMatch,
        select: "todo iscomplite createdAt",
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Xəta baş verdi",
      error: error.message,
    });
  }
}

async function createUser(req, res) {
  try {
    const { name, password, email, birth } = req.body;
    if (!name || !login || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const exUser = await usersM.findOne({ email });
    if (exUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = await usersM.create({
      name,
      email,
      password: hashedPass,
      birth,
    });
    return res.status(201).json({
      succes: true,
      message: "User created successfully",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        birth: newUser.birth,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
async function updatedUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password, birth } = req.body;
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (email) {
      updateData.email = email;
    }
    if (birth) {
      updateData.birth = birth;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    const updatedUser = await usersM
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .select("-password");
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
      return res.status(200).json({
        success: true,
        message: "User updated",
        data: updatedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deletedUser = await usersM.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
module.exports = { getAllUsersWithTodos, createUser, updatedUser, deleteUser };
