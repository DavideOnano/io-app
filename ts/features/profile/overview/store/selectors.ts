import * as pot from "@pagopa/ts-commons/lib/pot";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { createSelector } from "reselect";
import { GlobalState } from "../../../../store/reducers/types";
import { ProfileOverview, ProfileOverviewState } from "./types";

export const profileOverviewStateSelector = (
  state: GlobalState
): ProfileOverviewState => state.profileOverview;

export const profileOverviewDataSelector = createSelector(
  profileOverviewStateSelector,
  state =>
    pipe(
      state,
      pot.toOption,
      O.getOrElse<ProfileOverview | undefined>(() => undefined)
    )
);

export const profileOverviewErrorSelector = createSelector(
  profileOverviewStateSelector,
  state => (pot.isError(state) ? state.error : undefined)
);

export const profileOverviewIsLoadingSelector = createSelector(
  profileOverviewStateSelector,
  state => pot.isNone(state) || pot.isLoading(state) || pot.isUpdating(state)
);
