import { createFeatureSelector, createSelector } from "@ngrx/store";
import { taskAdapter, TaskState } from "./task.state";
import { TaskStatus } from "../../core/models/status.enum";

export const selectTaskState = createFeatureSelector<TaskState>("tasks");

const { selectIds, selectEntities, selectAll, selectTotal } =
  taskAdapter.getSelectors(selectTaskState);

export const selectAllTasks = selectAll;
export const selectTaskEntities = selectEntities;
export const selectTaskTotal = createSelector(
  selectTaskState,
  (state) => state.total
);
export const selectTaskIds = selectIds;

export const selectTaskLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTaskError = createSelector(
  selectTaskState,
  (state) => state.error
);

export const selectTaskById = (id: string) =>
  createSelector(
    selectAllTasks,
    (tasks) => tasks.find((task) => task.id === id) ?? null
  );

export const selectSelectedTaskId = createSelector(
  selectTaskState,
  (state) => state.selectedTaskId
);

export const selectSelectedTask = createSelector(
  selectTaskEntities,
  selectSelectedTaskId,
  (entities, selectedTaskId) =>
    selectedTaskId ? entities[selectedTaskId] ?? null : null
);

export const selectFilterStatus = createSelector(
  selectTaskState,
  (state) => state.filterStatus
);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectFilterStatus,
  (tasks, filterStatus) =>
    filterStatus ? tasks.filter((task) => task.status === filterStatus) : tasks
);

export const selectTasksByStatus = (status: TaskStatus) =>
  createSelector(
    selectAllTasks,
    (tasks) => tasks.filter((task) => task.status === status).length
  );
