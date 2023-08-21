import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

const whiteList = ["http://127.0.0.1:5500", "http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    console.log("ORIGIN: ", origin);
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

await mongoose.connect("mongodb://127.0.0.1:27017/taskManagerDB");

const TaskSchema = new mongoose.Schema({
  item: String,
  isDone: Boolean,
});

const Task = mongoose.model("Task", TaskSchema);

// newTask.save();

app
  .route("/task")
  .get(async (req, res) => {
    const response = await Task.find();
    //   const data = JSON.parse(response);
    res.json(response);
  })
  .post((req, res) => {
    const task = req.body.task;
    const task2 = req.body;
    console.log("New Task: ", task2);
    const newTask = new Task({
      item: task,
      isDone: false,
    });
    newTask.save();
    res.json(newTask);
  });

app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});
