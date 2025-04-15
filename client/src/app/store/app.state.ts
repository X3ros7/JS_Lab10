import { TaskState } from "./task/task.state";
import { RouterState } from "./router/router.state";
import { RouterReducerState } from "@ngrx/router-store";

export interface AppState {
  tasks: TaskState;
  router: RouterReducerState<RouterState>;
}
