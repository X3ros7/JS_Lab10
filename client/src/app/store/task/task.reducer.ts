import { createReducer, on } from "@ngrx/store";
import { taskAdapter, TaskState } from "./task.state";
import { initialState } from "./task.state";
import {
  loadTasksSuccess,
  loadTasksFailure,
  createTaskSuccess,
  createTaskFailure,
  updateTaskSuccess,
  updateTaskFailure,
  patchTaskSuccess,
  patchTaskFailure,
  deleteTaskSuccess,
  deleteTaskFailure,
  loadTasks,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  selectTask,
  setFilterStatus,
  clearTaskError,
} from "./task.actions";

export const taskReducer = createReducer(
  initialState,

  on(loadTasks, (state) => ({ ...state, loading: true, error: null })),

  on(loadTasksSuccess, (state: TaskState, { tasks, total }) =>
    taskAdapter.setAll(tasks, {
      ...state,
      total,
      loading: false,
      error: null,
    })
  ),

  on(loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(createTask, (state, { task }) =>
    taskAdapter.addOne(task, { ...state, loading: true, error: null })
  ),

  on(createTaskSuccess, (state, { task }) =>
    taskAdapter.addOne(task, { ...state, loading: false, error: null })
  ),

  on(createTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateTask, (state, { task }) =>
    taskAdapter.updateOne(
      { id: task.id, changes: task },
      { ...state, loading: true, error: null }
    )
  ),

  on(updateTaskSuccess, (state, { task }) =>
    taskAdapter.updateOne(
      { id: task.id, changes: task },
      { ...state, loading: false, error: null }
    )
  ),

  on(updateTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(patchTask, (state, { id, changes }) =>
    taskAdapter.updateOne(
      { id, changes },
      { ...state, loading: true, error: null }
    )
  ),

  on(patchTaskSuccess, (state, { task }) =>
    taskAdapter.updateOne(
      { id: task.id, changes: task },
      { ...state, loading: false, error: null }
    )
  ),

  on(patchTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteTask, (state, { id }) =>
    taskAdapter.removeOne(id, { ...state, loading: true, error: null })
  ),

  on(deleteTaskSuccess, (state, { id, total }) =>
    taskAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
      total,
    })
  ),

  on(deleteTaskFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(selectTask, (state, { id }) => ({
    ...state,
    selectedTaskId: id,
  })),

  on(setFilterStatus, (state, { status = "" }) => {
    console.log(`Status: ${status}`);
    return {
      ...state,
      filterStatus: status,
    };
  }),

  on(clearTaskError, (state) => ({
    ...state,
    error: null,
  }))
);
