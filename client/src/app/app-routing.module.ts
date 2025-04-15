import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskStatsComponent } from "./components/task-stats/task-stats.component";
import { TaskItemComponent } from "./components/task-item/task-item.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: "", redirectTo: "/(primary:tasks//aside:stats)", pathMatch: "full" },
  { path: "tasks", component: TaskListComponent },
  { path: "stats", component: TaskStatsComponent, outlet: "aside" },
  { path: "tasks/view/:id", component: TaskItemComponent },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
