import * as pot from "@pagopa/ts-commons/lib/pot";
import { getType } from "typesafe-actions";
import { Action } from "../../../../store/actions/types";
import { InitializedProfile } from "../../../../../definitions/backend/InitializedProfile";

import {
  profileOverviewLoad,
  profileOverviewReset,
  ProfileOverviewActions
} from "./actions";

export type ProfileOverview = {
  givenName?: string;
  familyName?: string;
  fiscalCode?: string;
  email?: string;
  birthDate?: Date;
};

export type ProfileOverviewState = pot.Pot<ProfileOverview, Error>;

export type ProfileOverviewMapper = (
  profile: InitializedProfile
) => ProfileOverview;

const INITIAL_STATE: ProfileOverviewState = pot.none;

const PROFILE_OVERVIEW_ACTION_TYPES: ReadonlyArray<
  ProfileOverviewActions["type"]
> = [
  getType(profileOverviewReset),
  getType(profileOverviewLoad.request),
  getType(profileOverviewLoad.success),
  getType(profileOverviewLoad.failure)
];

const isProfileOverviewAction = (
  action: Action
): action is ProfileOverviewActions =>
  PROFILE_OVERVIEW_ACTION_TYPES.includes(
    action.type as ProfileOverviewActions["type"]
  );

const profileOverviewReducer = (
  state: ProfileOverviewState = INITIAL_STATE,
  action: Action
): ProfileOverviewState => {
  if (!isProfileOverviewAction(action)) {
    return state;
  }

  switch (action.type) {
    case getType(profileOverviewReset):
      return pot.none;
    case getType(profileOverviewLoad.request):
      return pot.toLoading(state);
    case getType(profileOverviewLoad.success):
      return pot.some(action.payload);
    case getType(profileOverviewLoad.failure):
      return pot.toError(state, action.payload);
    default:
      return state;
  }
};

export { profileOverviewReducer, INITIAL_STATE as profileOverviewInitialState };
