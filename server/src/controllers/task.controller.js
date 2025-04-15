import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";

    const filter = req.query.filter?.trim().toLowerCase() || "";
    const status = req.query.status || "";

    const searchQuery = filter
      ? {
          $or: [
            { title: { $regex: filter, $options: "i" } },
            { description: { $regex: filter, $options: "i" } },
            { assignee: { $regex: filter, $options: "i" } },
          ],
        }
      : {};
    const statusQuery = status ? { status } : {};
    const query = { ...searchQuery, ...statusQuery };

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    res.json({
      tasks,
      total,
    });
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
    const total = await Task.countDocuments();
    res.json({ message: `Task ${req.params.id} deleted`, total });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
