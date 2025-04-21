import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { Task } from "../../core/models/task.model";
import { TaskStatus } from "../../core/models/status.enum";
import {
  Observable,
  Subject,
  takeUntil,
  combineLatest,
  map,
  debounceTime,
  distinctUntilChanged,
  startWith,
  filter,
  switchMap,
  tap,
  pipe,
  take,
} from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { TaskFormComponent } from "../task-form/task-form.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl } from "@angular/forms";
import { MatSelectChange } from "@angular/material/select";
import { Store } from "@ngrx/store";
import {
  selectAllTasks,
  selectFilteredTasks,
  selectTaskError,
  selectTaskLoading,
  selectTaskTotal,
} from "../../store/task/task.selectors";
import { AppState } from "../../store/app.state";
import {
  deleteTask,
  loadTasks,
  selectTask,
  setFilterStatus,
} from "../../store/task/task.actions";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Router } from "@angular/router";

@Component({
  selector: "app-task-list",
  standalone: false,
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.scss",
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
  myTasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  selectedStatus: TaskStatus | "" = "";
  editingTask: Task | null = null;
  private destroy$ = new Subject<void>();
  hasLoading = false;
  filterControl = new FormControl("");
  statusControl = new FormControl("");
  tasks$!: Observable<Task[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    "title",
    "description",
    "assignee",
    "status",
    "actions",
  ];
  dataSource = new MatTableDataSource<Task>();
  totalTasks$: Observable<number> = new Observable();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks(1, 5);

    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTaskLoading);
    this.error$ = this.store.select(selectTaskError);
    this.totalTasks$ = this.store.select(selectTaskTotal);

    this.tasks$.pipe(takeUntil(this.destroy$)).subscribe((tasks) => {
      this.dataSource.data = tasks;
    });

    this.statusControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((status) => {
        this.paginator.firstPage();
        this.loadTasks(1, 5, this.filterControl.value ?? "", status ?? "");
      });

    this.filterControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((filter) => {
        this.paginator.firstPage();
        this.loadTasks(1, 5, filter ?? "", this.statusControl.value ?? "");
      });

    this.error$.pipe(takeUntil(this.destroy$)).subscribe((error) => {
      if (error) {
        this.snackBar.open(error, "Close", { duration: 3000 });
      }
    });

    this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.hasLoading = loading;
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(startWith({ pageIndex: 0, pageSize: 5 }), takeUntil(this.destroy$))
      .subscribe(({ pageIndex, pageSize }) => {
        this.loadTasks(
          pageIndex + 1,
          pageSize,
          this.filterControl.value ?? "",
          this.statusControl.value ?? ""
        );
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: "80vw",
      height: "70vh",
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => result === "created"))
      .subscribe(() => {
        this.goToLastPage();
      });
  }

  viewTask(id: string): void {
    this.router.navigate([
      { outlets: { primary: ["tasks", "view", id], aside: null } },
    ]);
  }

  editTask(id: string): void {
    this.store.dispatch(selectTask({ id }));
    this.openDialog();
  }

  onSelected(event: MatSelectChange): void {
    console.log(event.value);
    this.store.dispatch(setFilterStatus({ status: event.value as TaskStatus }));
  }

  private loadTasks(
    page: number,
    pageSize: number,
    filter: string = "",
    status: string = ""
  ): void {
    this.store.dispatch(
      loadTasks({
        page,
        pageSize,
        filter,
        status,
      })
    );
  }

  deleteTask(id: string): void {
    this.store.dispatch(deleteTask({ id }));
    this.tasks$.pipe(take(1)).subscribe((tasks) => {
      const isLastItemOnPage = tasks.length === 1;
      const currentPage = this.paginator.pageIndex + 1;

      const goToPage =
        isLastItemOnPage && currentPage > 1 ? currentPage - 1 : currentPage;

      this.loadTasks(
        goToPage,
        this.paginator.pageSize,
        this.filterControl.value ?? "",
        this.statusControl.value as TaskStatus | ""
      );
    });
  }

  private goToLastPage(): void {
    this.totalTasks$.pipe(take(1)).subscribe((total) => {
      const lastPage = Math.ceil(total + 1 / this.paginator.pageSize);
      this.paginator.pageIndex = lastPage - 1;

      this.loadTasks(
        lastPage,
        this.paginator.pageSize,
        this.filterControl.value ?? "",
        this.statusControl.value as TaskStatus | ""
      );
    });
  }

  protected readonly TaskStatus = TaskStatus;
}
