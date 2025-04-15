import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  loadTasks,
  loadTasksSuccess,
  loadTasksFailure,
  createTask,
  createTaskSuccess,
  createTaskFailure,
  updateTask,
  updateTaskSuccess,
  updateTaskFailure,
  patchTaskSuccess,
  patchTask,
  patchTaskFailure,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure,
  clearTaskError,
} from "./task.actions";
import { TaskService } from "../../services/task.service";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { formatError } from "../../share/utils/error.utils";
import { TaskStatus } from "../../core/models/status.enum";

@Injectable()
export class TaskEffects {
  actions$ = inject(Actions);
  taskService = inject(TaskService);
  store = inject(Store);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      switchMap(({ status, page, pageSize, filter }) =>
        this.taskService
          .getTasks(status as TaskStatus, page, pageSize, filter)
          .pipe(
            map((response) =>
              loadTasksSuccess({
                tasks: response.tasks,
                total: response.total,
              })
            ),
            catchError((error) => {
              return of(loadTasksFailure({ error: formatError(error) }));
            })
          )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTask),
      mergeMap(({ task }) =>
        this.taskService.createTask(task).pipe(
          map((task) => createTaskSuccess({ task })),
          catchError((error) => {
            return of(createTaskFailure({ error: formatError(error) }));
          })
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTask),
      switchMap(({ task }) =>
        this.taskService.updateTask(task.id, task).pipe(
          map((task) => updateTaskSuccess({ task })),
          catchError((error) => {
            return of(updateTaskFailure({ error: formatError(error) }));
          })
        )
      )
    )
  );

  patchTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(patchTask),
      switchMap(({ id, changes }) =>
        this.taskService.patchTask(id, changes).pipe(
          map((task) => patchTaskSuccess({ task })),
          catchError((error) => {
            return of(patchTaskFailure({ error: formatError(error) }));
          })
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),
      mergeMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map((response) => deleteTaskSuccess({ id, total: response.total })),
          catchError((error) => {
            return of(deleteTaskFailure({ error: formatError(error) }));
          })
        )
      )
    )
  );

  resetError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadTasksFailure,
        createTaskFailure,
        updateTaskFailure,
        patchTaskFailure,
        deleteTaskFailure
      ),
      map(() => clearTaskError())
    )
  );
}
