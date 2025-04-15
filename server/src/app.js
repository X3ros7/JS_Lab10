import express from "express";
import cors from "cors";

import taskMockRoutes from "./routes/taskMockRouter.js";
import taskRoutes from "./routes/task.route.js";
import {
  formatResponseMiddleware,
  parseDateMiddleware,
} from "./middleware/dateMiddleware.js";
import { connectDB } from "./config/db.js";

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/tasks", taskMockRoutes);
app.use("/api/v2/tasks", taskRoutes);

export default app;
