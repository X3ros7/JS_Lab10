import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  patchTask,
  updateTask,
} from "../controllers/task.controller.js";
import {
  validateTask,
  handleValidationErrors,
  validateTaskPatch,
} from "../validators/taskValidator.js";

const taskRoutes = Router();

taskRoutes.get("/", getTasks);
taskRoutes.post("/", validateTask, handleValidationErrors, createTask);
taskRoutes.put("/:id", validateTask, handleValidationErrors, updateTask);
taskRoutes.patch("/:id", validateTaskPatch, handleValidationErrors, patchTask);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
