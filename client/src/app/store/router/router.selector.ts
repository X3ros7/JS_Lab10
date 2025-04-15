import { createFeatureSelector, createSelector } from "@ngrx/store";
import { getRouterSelectors, RouterReducerState } from "@ngrx/router-store";
import { RouterState } from "./router.state";

export const selectorRouter =
  createFeatureSelector<RouterReducerState<RouterState>>("router");

export const {
  selectCurrentRoute,
  selectQueryParams,
  selectRouteParams,
  selectRouteData,
  selectUrl,
  selectFragment,
} = getRouterSelectors(selectorRouter);
