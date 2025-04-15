import { tasks } from "../models/taskMockModel.js";
import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation errors", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }
    return res.status(400).json({ message: "Error creating task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndReplace(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation errors", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }
    return res.status(400).json({ message: "Error updating task" });
  }
};

export const patchTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation errors", errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Task already exists" });
    }
    res.status(400).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id });
    if (!deletedTask) {
      res.status(404).json({ message: "Task not found" });
    }
    res.json(`Task ${req.params.id} deleted`);
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
