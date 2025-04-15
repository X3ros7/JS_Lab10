import { Inject, Injectable } from "@angular/core";
import { Task, TaskLoad } from "../core/models/task.model";
import { tasks as mock_tasks } from "../core/moc_data/tasks";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CONFIG_TOKEN } from "../configs/config";
import { AppConfig } from "../configs/config";
import { Observable, of, catchError } from "rxjs";
import { TaskStatus } from "../core/models/status.enum";
import { TaskAdapter } from "../share/adapters/task.adapter";
import { delay, map } from "rxjs/operators";
import { TaskApi, TaskLoadApi } from "../core/models/task-api.model";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private tasks: Task[] = [...mock_tasks];

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig
  ) {}

  createTask(task: Omit<Task, "id">): Observable<Task> {
    return this.http
      .post<TaskApi>(`${this.config.apiUrl}/tasks`, task)
      .pipe(map((task) => TaskAdapter.fromAPI(task)));
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http
      .put<TaskApi>(
        `${this.config.apiUrl}/tasks/${id}`,
        TaskAdapter.toAPI(task)
      )
      .pipe(map((task) => TaskAdapter.fromAPI(task)));
  }

  patchTask(id: string, task: Partial<Task>): Observable<Task> {
    const formattedTask = TaskAdapter.toPartialApi(task);
    console.log(formattedTask, id);
    return this.http
      .patch<TaskApi>(`${this.config.apiUrl}/tasks/${id}`, {
        ...formattedTask,
        ...task,
      })
      .pipe(map((task) => TaskAdapter.fromAPI(task)));
  }

  deleteTask(id: string): Observable<{ message: string; total: number }> {
    return this.http.delete<{ message: string; total: number }>(
      `${this.config.apiUrl}/tasks/${id}`
    );
  }

  getTasks(
    status?: TaskStatus,
    page: number = 1,
    pageSize: number = 10,
    filter?: string
  ): Observable<TaskLoad> {
    let params = new HttpParams().set("page", page).set("pageSize", pageSize);

    if (status) {
      params = params.set("status", status);
    }

    if (filter) {
      params = params.set("filter", filter);
    }

    return this.http
      .get<TaskLoadApi>(`${this.config.apiUrl}/tasks`, {
        params,
      })
      .pipe(map((tasks: TaskLoadApi) => TaskAdapter.fromLoadApi(tasks)));
  }
}
