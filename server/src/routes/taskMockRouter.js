import * as taskMockController from "../controllers/taskMockController.js";
import { Router } from "express";
import {
  validateTask,
  validateTaskPatch,
  handleValidationErrors,
} from "../validators/taskValidator.js";

const taskMockRoutes = Router();

taskMockRoutes.get("/", taskMockController.getTasks);
taskMockRoutes.post(
  "/",
  validateTask,
  handleValidationErrors,
  taskMockController.createTask
);
taskMockRoutes.put(
  "/:id",
  validateTask,
  handleValidationErrors,
  taskMockController.updateTask
);
taskMockRoutes.patch(
  "/:id",
  validateTaskPatch,
  handleValidationErrors,
  taskMockController.patchTask
);
taskMockRoutes.delete("/:id", taskMockController.deleteTask);

export default taskMockRoutes;
