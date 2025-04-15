import { Pipe, PipeTransform } from "@angular/core";
import { Task } from "../../core/models/task.model";
import { TaskStatus } from "../../core/models/status.enum";

@Pipe({
  name: "statusFilter",
  pure: false,
  standalone: false,
})
export class StatusFilterPipe implements PipeTransform {
  transform(status: TaskStatus): string {
    const statusMap: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: "To Do",
      [TaskStatus.IN_PROGRESS]: "In Progress",
      [TaskStatus.DONE]: "Done",
    };
    return statusMap[status] || "Unknown";
  }
}
