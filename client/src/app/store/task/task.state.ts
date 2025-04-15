import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";
import { Task } from "../../core/models/task.model";

export interface TaskState extends EntityState<Task> {
  loading: boolean;
  error: string | null;
  selectedTaskId: string | null;
  filterStatus: string;
  total: number;
}

export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialState: TaskState = taskAdapter.getInitialState({
  loading: false,
  error: null,
  selectedTaskId: null,
  filterStatus: "",
  total: 0,
});
