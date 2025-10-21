import * as pot from "@pagopa/ts-commons/lib/pot";
import { Action } from "../../../../store/actions/types";
import {
  PROFILE_OVERVIEW_LOAD_FAILURE,
  PROFILE_OVERVIEW_LOAD_REQUEST,
  PROFILE_OVERVIEW_LOAD_SUCCESS,
  PROFILE_OVERVIEW_RESET,
  ProfileOverviewActions
} from "./actions";
import { ProfileOverviewState } from "./types";

const INITIAL_STATE: ProfileOverviewState = pot.none;

const PROFILE_OVERVIEW_ACTION_TYPES: ReadonlyArray<
  ProfileOverviewActions["type"]
> = [
  PROFILE_OVERVIEW_RESET,
  PROFILE_OVERVIEW_LOAD_REQUEST,
  PROFILE_OVERVIEW_LOAD_SUCCESS,
  PROFILE_OVERVIEW_LOAD_FAILURE
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
    case PROFILE_OVERVIEW_RESET:
      return pot.none;
    case PROFILE_OVERVIEW_LOAD_REQUEST:
      return pot.toLoading(state);
    case PROFILE_OVERVIEW_LOAD_SUCCESS:
      return pot.some(action.payload);
    case PROFILE_OVERVIEW_LOAD_FAILURE:
      return pot.toError(state, action.payload);
    default:
      return state;
  }
};

export { profileOverviewReducer, INITIAL_STATE as profileOverviewInitialState };
