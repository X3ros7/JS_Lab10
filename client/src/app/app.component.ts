import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { loadTasks } from "./store/task/task.actions";
import { AppState } from "./store/app.state";
import { selectUrl } from "./store/router/router.selector";
import { filter, map, Observable } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  standalone: false,
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "lab10";
  isTasksRoute$: Observable<boolean> = new Observable();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.isTasksRoute$ = this.store.select(selectUrl).pipe(
      filter((url) => !!url),
      map((url) => url.startsWith("/tasks(aside:stats)"))
    );
  }
}
