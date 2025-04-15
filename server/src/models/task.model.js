import mongoose from "mongoose";
import { TaskStatus } from "../constants/taskStatus.js";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    default: "",
  },
  assignee: {
    type: String,
    trim: true,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  },
});

// TaskSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;

//     if (ret.dueDate) {
//       ret.dueDate = ret.dueDate.toISOString().split("T")[0];
//     }

//     return ret;
//   },
// });

const Task = mongoose.model("Task", TaskSchema);

export default Task;
