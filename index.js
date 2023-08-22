import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

const whiteList = ["http://127.0.0.1:5500", "http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
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
    const newTask = new Task({
      item: task,
      isDone: false,
    });
    newTask.save();
    res.json(newTask);
  })
  .delete(async (req, res) => {
    try {
      await Task.deleteMany({});
      res.json("All Tasks Deleted Successfully");
    } catch (err) {
      res.status(404).json({ Error: err.message });
    }
  });

app
  .route("/task/:id")
  .get(async (req, res) => {
    try {
      const targetTask = await Task.findById(id);
      if (!targetTask) {
        throw new Error("Task with id does not exist");
      }
      res.status(200).json(targetTask);
    } catch (err) {
      res.status(404).json({ Error: err.message });
    }
  })
  .put(async (req, res) => {
    try {
      await Task.findOneAndReplace({ _id: req.params.id }, req.body);
      res.json("Task Replaced Successfully");
    } catch (err) {
      res.status(404).json({ Error: err.message });
    }
  })
  .patch(async (req, res) => {
    const id = req.params.id;
    try {
      const targetTask = await Task.findById(id);
      if (!targetTask) {
        throw new Error("Task with id does not exist");
      }
      await Task.findByIdAndUpdate(id, req.body);
      res.json("Task Updated Successfully!");
    } catch (err) {
      res.status(404).json({ Error: err.message });
    }
  })
  .delete(async (req, res) => {
    const id = req.params.id;
    try {
      const targetTask = await Task.findById(id);
      if (!targetTask) {
        throw new Error("Task with id does not exist");
      }
      await Task.findByIdAndDelete(id);
      res.status(200).json("Task Deleted Successfully");
    } catch (err) {
      res.status(404).json({ Error: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});
