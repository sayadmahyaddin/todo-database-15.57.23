require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connect = require("./src/db/db");
const User = require("./src/models/users.m");
const Todo = require("./src/models/todo.m");

async function seed() {
  try {
    const password = process.env.SEED_PASSWORD;

    if (!password || password.length < 6) {
      throw new Error("Set SEED_PASSWORD to at least 6 characters.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const sampleUsers = [
      { name: "David Məmmədov", email: "david@davidjs.dev", age: 22 },
      { name: "Əli Əliyev", email: "ali@example.com", age: 25 },
      { name: "Aysel Həsənova", email: "aysel@example.com", age: 24 },
      { name: "Rəşad Quliyev", email: "rashad@example.com", age: 26 }
    ];

    const sampleTasks = [
      [
        ["Node.js və Express ilə Auth sistemini tamamlamaq", true],
        ["Todo CRUD əməliyyatlarını yazmaq", false],
        ["Zod ilə request validation əlavə etmək", false]
      ],
      [
        ["MongoDB Atlas bağlantısını yoxlamaq", true],
        ["JWT middleware test etmək", false]
      ],
      [
        ["Frontend üçün API sənədlərini hazırlamaq", false],
        ["CORS tənzimləmələrini yoxlamaq", true]
      ],
      [
        ["Bcrypt ilə şifrələməni test etmək", true],
        ["Postman kolleksiyasını yeniləmək", false]
      ]
    ];

    // Prepare IDs and validate all sample data before writing.
    const users = sampleUsers.map(
      (data) => new User({ ...data, password: hashedPassword })
    );

    const tasks = users.map((user, index) =>
      sampleTasks[index].map(
        ([title, completed]) =>
          new Todo({ title, completed, user: user._id })
      )
    );

    for (const user of users) {
      await user.validate();
    }

    for (const todo of tasks.flat()) {
      await todo.validate();
    }

    await connect();

    for (let index = 0; index < users.length; index++) {
      const sampleUser = users[index];

      let user = await User.findOne({ email: sampleUser.email });

      if (!user) {
        user = await sampleUser.save();
        console.log(`Created: ${user.email}`);
      } else {
        console.log(`Already exists: ${user.email} — password unchanged`);
      }

      for (const sampleTodo of tasks[index]) {
        const existingTodo = await Todo.findOne({
          user: user._id,
          title: sampleTodo.title
        });

        if (!existingTodo) {
          await Todo.create({
            title: sampleTodo.title,
            completed: sampleTodo.completed,
            user: user._id
          });
        }
      }
    }

    console.log("Seed completed.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();