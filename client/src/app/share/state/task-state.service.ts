// import { Injectable } from "@angular/core";
// import {
//   BehaviorSubject,
//   catchError,
//   finalize,
//   of,
//   switchMap,
//   tap,
//   throwError,
// } from "rxjs";
// import { Task, TaskLoad } from "../../core/models/task.model";
// import { TaskService } from "../../services/task.service";

// @Injectable({
//   providedIn: "root",
// })
// export class TaskStateService {
//   private _tasks$ = new BehaviorSubject<TaskLoad>({
//     tasks: [],
//     total: 0,
//   });
//   private _selectedTask$ = new BehaviorSubject<Task | null>(null);
//   private _loading$ = new BehaviorSubject<boolean>(false);
//   private _error$ = new BehaviorSubject<string | null>(null);

//   public task$ = this._tasks$.asObservable();
//   public selectedTask$ = this._selectedTask$.asObservable();
//   public loading$ = this._loading$.asObservable();
//   public error$ = this._error$.asObservable();

//   constructor(private taskService: TaskService) {}

//   loadTasks() {
//     this._loading$.next(true);
//     this._error$.next(null);

//     this.taskService
//       .getTasks()
//       .pipe(
//         tap((tasks) => {
//           this._tasks$.next(tasks);
//         }),
//         catchError((error) => {
//           this._error$.next(error.message);
//           return throwError(() => error.message);
//         }),
//         finalize(() => this._loading$.next(false))
//       )
//       .subscribe();
//   }

//   createTask(task: Task) {
//     this._loading$.next(true);
//     this._error$.next(null);

//     this.taskService
//       .createTask(task)
//       .pipe(
//         switchMap((addedTask: Task) => {
//           const currentTasks = this._tasks$.getValue();
//           return of({
//             ...currentTasks,
//             tasks: [...currentTasks.tasks, addedTask],
//             total: currentTasks.total + 1,
//           });
//         }),
//         tap((tasks) => this._tasks$.next(tasks)),
//         finalize(() => this._loading$.next(false)),
//         catchError((error) => {
//           this._error$.next(error.message);
//           return throwError(() => error.message);
//         })
//       )
//       .subscribe();
//   }

//   updateTask(task: Task) {
//     this._loading$.next(true);
//     this._error$.next(null);

//     this.taskService
//       .updateTask(task.id, task)
//       .pipe(
//         switchMap((updatedTask: Task) => {
//           const currentTasks = this._tasks$.getValue();
//           return of(
//             currentTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
//           );
//         }),
//         tap((tasks) => this._tasks$.next(tasks)),
//         finalize(() => this._loading$.next(false)),
//         catchError((error) => {
//           this._error$.next(
//             error.error.errors
//               ? `${error.error.message}. ${error.error.errors}`
//               : error.error.message
//           );
//           return throwError(() => error.message);
//         })
//       )
//       .subscribe();
//   }

//   patchTask(id: string, task: Partial<Task>) {
//     console.log(`Patching task: ${id}`);
//     this._loading$.next(true);
//     this._error$.next(null);

//     this.taskService
//       .patchTask(id, task)
//       .pipe(
//         switchMap((updatedTask: Task) => {
//           const currentTasks = this._tasks$.getValue();
//           return of(
//             currentTasks.map((t) =>
//               t.id === id ? Object.assign({}, t, updatedTask) : t
//             )
//           );
//         }),
//         tap((tasks) => this._tasks$.next(tasks)),
//         finalize(() => this._loading$.next(false)),
//         catchError((error) => {
//           this._error$.next(error.message);
//           return throwError(() => error.message);
//         })
//       )
//       .subscribe();
//   }

//   deleteTask(id: string) {
//     this._loading$.next(true);
//     this._error$.next(null);

//     this.taskService
//       .deleteTask(id)
//       .pipe(
//         switchMap(() => {
//           const currentTasks = this._tasks$.getValue();
//           return of(currentTasks.filter((t) => t.id !== id));
//         }),
//         tap((tasks) => this._tasks$.next(tasks)),
//         finalize(() => this._loading$.next(false)),
//         catchError((error) => {
//           this._error$.next(error.message);
//           return throwError(() => error.message);
//         })
//       )
//       .subscribe();
//   }

//   selectTask(task: Task | null) {
//     this._selectedTask$.next(task);
//   }
// }
