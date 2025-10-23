import { createAsyncAction, createStandardAction } from "typesafe-actions";
import { ProfileOverview } from "./types";

export const profileOverviewLoad = createAsyncAction(
  "profile/overview/load/request",
  "profile/overview/load/success",
  "profile/overview/load/failure"
)<void, ProfileOverview, Error>();

export const profileOverviewReset = createStandardAction(
  "profile/overview/reset"
)();

export type ProfileOverviewActions =
  | ReturnType<typeof profileOverviewLoad.request>
  | ReturnType<typeof profileOverviewLoad.success>
  | ReturnType<typeof profileOverviewLoad.failure>
  | ReturnType<typeof profileOverviewReset>;
