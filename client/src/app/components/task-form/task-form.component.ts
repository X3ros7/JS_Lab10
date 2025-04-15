import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { Task } from "../../core/models/task.model";
import { TaskStatus } from "../../core/models/status.enum";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { TaskFormValidator } from "../../share/directives/task-form.validator";
import { MatDialogRef } from "@angular/material/dialog";
import { filter, Observable, Subject, take, takeUntil } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import { FormBuilder } from "@angular/forms";
import {
  updateTask,
  createTask,
  selectTask,
} from "../../store/task/task.actions";
import {
  selectSelectedTask,
  selectTaskLoading,
} from "../../store/task/task.selectors";

@Component({
  selector: "app-task-form",
  standalone: false,
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.scss",
})
export class TaskFormComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  selectedTask$!: Observable<Task | null>;
  taskForm!: FormGroup;
  editMode: boolean = false;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskFormComponent>
  ) {}

  ngOnInit(): void {
    this.selectedTask$ = this.store.select(selectSelectedTask);
    this.taskForm = this.fb.group({
      id: [""],
      title: ["", Validators.required],
      description: [
        "",
        TaskFormValidator.forbiddenWordsValidator(["React", "Vue"]),
      ],
      dueDate: ["", [Validators.required, TaskFormValidator.dateValidator]],
      assignee: ["", Validators.required],
      status: [TaskStatus.TODO, Validators.required],
    });
    this.selectedTask$.pipe(takeUntil(this.destroy$)).subscribe((task) => {
      if (task) {
        this.taskForm.patchValue(task);
        this.editMode = true;
      } else {
        this.taskForm.reset({ status: TaskStatus.TODO });
        this.editMode = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.editMode) {
        this.store.dispatch(updateTask({ task: { ...this.taskForm.value } }));
      } else {
        const { id, ...taskWithoutId } = this.taskForm.value;
        this.store.dispatch(createTask({ task: taskWithoutId }));
      }
      this.store
        .select(selectTaskLoading)
        .pipe(
          filter((isLoading) => !isLoading),
          take(1)
        )
        .subscribe((error) => {
          if (error) {
            this.dialogRef.close(this.editMode ? "updated" : "created");
            this.store.dispatch(selectTask({ id: null }));
          }
        });
    }
  }

  ngOnDestroy() {
    this.store.dispatch(selectTask({ id: null }));
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly TaskStatus = TaskStatus;
}
