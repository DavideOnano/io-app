import * as pot from "@pagopa/ts-commons/lib/pot";
import { InitializedProfile } from "../../../../../definitions/backend/InitializedProfile";

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
