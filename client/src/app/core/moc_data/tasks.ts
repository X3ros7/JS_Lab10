import { Task } from "../models/task.model";
import { TaskStatus } from "../models/status.enum";

export const tasks: Task[] = [
  {
    id: "0",
    title: "Install Angular",
    assignee: "Me",
    dueDate: new Date("2025-02-14").toISOString(),
    status: TaskStatus.TODO,
  },
  {
    id: "1",
    title: "Learn what is components",
    description: "Learn what is components in Angular",
    assignee: "me",
    dueDate: new Date("2025-02-15").toISOString(),
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: "2",
    title: "Learn what is modules",
    description: "Learn what is modules in Angular",
    assignee: "me",
    dueDate: new Date("2025-02-16").toISOString(),
    status: TaskStatus.DONE,
  },
];
