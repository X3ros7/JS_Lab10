import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskItemComponent } from "./components/task-item/task-item.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StatusFilterPipe } from "./share/pipes/status-filter.pipe";
import { TaskFormComponent } from "./components/task-form/task-form.component";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { withInterceptorsFromDi } from "@angular/common/http";
import { TaskStatusPipe } from "./share/pipes/task-status.pipe";
import { MatDialogModule } from "@angular/material/dialog";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppState } from "./store/app.state";
import { taskReducer } from "./store/task/task.reducer";
import { TaskEffects } from "./store/task/task.effects";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { routerReducer } from "@ngrx/router-store";
import { TaskStatsComponent } from "./components/task-stats/task-stats.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskItemComponent,
    StatusFilterPipe,
    TaskFormComponent,
    TaskStatusPipe,
    TaskStatsComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    StoreModule.forRoot<AppState>({
      tasks: taskReducer,
      router: routerReducer,
    }),
    EffectsModule.forRoot([TaskEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot({ stateKey: "router" }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
