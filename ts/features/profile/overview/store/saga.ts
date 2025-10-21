import * as Either from "fp-ts/lib/Either";
import I18n from "i18next";
import { call, put, takeLatest } from "typed-redux-saga/macro";
import { getType } from "typesafe-actions";
import { BackendClient } from "../../../../api/backend";
import { readablePrivacyReport } from "../../../../utils/reporters";
import { convertUnknownToError } from "../../../../utils/errors";
import { ReduxSagaEffect, SagaCallReturnType } from "../../../../types/utils";
import { withRefreshApiCall } from "../../../authentication/fastLogin/saga/utils";
import { profileOverviewLoad } from "./actions";
import { ProfileOverviewMapper } from "./types";

const mapInitializedProfileToOverview: ProfileOverviewMapper = profile => ({
  givenName: profile.name,
  familyName: profile.family_name,
  fiscalCode: profile.fiscal_code,
  email: profile.email,
  birthDate: profile.date_of_birth
});

export function* handleProfileOverviewLoad(
  getProfile: ReturnType<typeof BackendClient>["getProfile"]
): Generator<ReduxSagaEffect, void, SagaCallReturnType<typeof getProfile>> {
  try {
    // retrieve profile data from backend
    const response = (yield* call(
      withRefreshApiCall,
      getProfile({})
    )) as unknown as SagaCallReturnType<typeof getProfile>;

    if (Either.isLeft(response)) {
      throw Error(readablePrivacyReport(response.left));
    }

    if (response.right.status === 200) {
      yield* put(
        profileOverviewLoad.success(
          mapInitializedProfileToOverview(response.right.value)
        )
      );
      return;
    }

    throw Error(
      I18n.t("profile.overview.errors.load", {
        defaultValue: "Impossibile recuperare il profilo"
      })
    );
  } catch (error) {
    yield* put(profileOverviewLoad.failure(convertUnknownToError(error)));
  }
}

export function* watchProfileOverviewLoad(
  getProfile: ReturnType<typeof BackendClient>["getProfile"]
): Generator<ReduxSagaEffect, void, any> {
  yield* takeLatest(
    getType(profileOverviewLoad.request),
    handleProfileOverviewLoad,
    getProfile
  );
}
