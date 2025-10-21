import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { ProfileOverview } from "./types";

export const PROFILE_OVERVIEW_LOAD_REQUEST = "profile/overview/load/request";
export const PROFILE_OVERVIEW_LOAD_SUCCESS = "profile/overview/load/success";
export const PROFILE_OVERVIEW_LOAD_FAILURE = "profile/overview/load/failure";
export const PROFILE_OVERVIEW_RESET = "profile/overview/reset";

export const profileOverviewLoad = createAsyncAction(
  PROFILE_OVERVIEW_LOAD_REQUEST,
  PROFILE_OVERVIEW_LOAD_SUCCESS,
  PROFILE_OVERVIEW_LOAD_FAILURE
)<void, ProfileOverview, Error>();

export const profileOverviewReset = createStandardAction(
  PROFILE_OVERVIEW_RESET
)();

export type ProfileOverviewActions =
  | ReturnType<typeof profileOverviewLoad.request>
  | ReturnType<typeof profileOverviewLoad.success>
  | ReturnType<typeof profileOverviewLoad.failure>
  | ReturnType<typeof profileOverviewReset>;
