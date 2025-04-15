import { TaskStatus } from "../constants/taskStatus.js";

export const tasks = [
  {
    id: 1,
    title: "Download Angular",
    assignee: "Me",
    dueDate: new Date("2025-02-14"),
    status: TaskStatus.DONE,
  },
];
