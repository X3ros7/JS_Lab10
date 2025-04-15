import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Task } from "../../core/models/task.model";
import { TaskStatus } from "../../core/models/status.enum";
import { MatSelectChange } from "@angular/material/select";
import { Store } from "@ngrx/store";
import { AppState } from "../../store/app.state";
import {
  deleteTask,
  patchTask,
  selectTask,
} from "../../store/task/task.actions";
import { Observable, Subject, switchMap, takeUntil } from "rxjs";
import { selectRouteParams } from "../../store/router/router.selector";
import { selectTaskById } from "../../store/task/task.selectors";

@Component({
  selector: "app-task-item",
  standalone: false,
  templateUrl: "./task-item.component.html",
  styleUrl: "./task-item.component.scss",
})
export class TaskItemComponent implements OnInit, OnDestroy {
  task$!: Observable<Task | null>;
  destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  deleteTask(id: string): void {
    this.store.dispatch(deleteTask({ id }));
  }

  ngOnInit(): void {
    this.task$ = this.store.select(selectRouteParams).pipe(
      takeUntil(this.destroy$),
      switchMap((params) => this.store.select(selectTaskById(params["id"])))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateStatus(id: string, event: MatSelectChange) {
    const selectedValue = event.value;
    this.store.dispatch(patchTask({ id, changes: { status: selectedValue } }));
  }

  getStatusClass(status: TaskStatus): string {
    return `chip-${status.toLowerCase()}`;
  }

  protected readonly TaskStatus = TaskStatus;
}
