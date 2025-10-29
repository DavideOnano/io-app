import * as pot from "@pagopa/ts-commons/lib/pot";
import { waitFor } from "@testing-library/react-native";
import configureMockStore from "redux-mock-store";
import { UserDataProcessingChoiceEnum } from "../../../../../../definitions/backend/UserDataProcessingChoice";
import { UserDataProcessingStatusEnum } from "../../../../../../definitions/backend/UserDataProcessingStatus";
import { applicationChangeState } from "../../../../../store/actions/application";
import { appReducer } from "../../../../../store/reducers";
import { GlobalState } from "../../../../../store/reducers/types";
import { renderScreenWithNavigationStoreContext } from "../../../../../utils/testWrapper";
import { SETTINGS_ROUTES } from "../../../../settings/common/navigation/routes";
import { loadUserDataProcessing } from "../../../../settings/common/store/actions/userDataProcessing";
import { profileOverviewLoad } from "../../store/actions";
import ProfileOverviewScreen from "../ProfileOverviewScreen";

const mockStore = configureMockStore<GlobalState>();

/**
 * Utility to render the screen inside a stack navigator with a mocked store.
 */
const renderComponentMockStore = (overrides: Partial<GlobalState> = {}) => {
  const baseState = appReducer(undefined, applicationChangeState("active"));
  const store = mockStore({
    ...baseState,
    profileOverview: pot.some({}),
    ...overrides
  });

  const renderAPI = renderScreenWithNavigationStoreContext(
    ProfileOverviewScreen,
    SETTINGS_ROUTES.PROFILE_DATA,
    {},
    store
  );

  return { store, ...renderAPI };
};

describe("ProfileOverviewScreen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // The screen should trigger both fetch actions as soon as it mounts.
  it("dispatches profile and user data processing loads on mount", async () => {
    const { store } = renderComponentMockStore();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          profileOverviewLoad.request(),
          loadUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
        ])
      );
    });
  });

  // With no data yet we only show the loading state container.
  it("hides the native switch while deletion status is loading or missing", () => {
    const { queryByTestId, getByTestId } = renderComponentMockStore({
      userDataProcessing: {
        [UserDataProcessingChoiceEnum.DELETE]: pot.none,
        [UserDataProcessingChoiceEnum.DOWNLOAD]: pot.none
      }
    });

    expect(getByTestId("profile-overview-profile-deletion")).not.toBeNull();
    expect(
      queryByTestId("profile-overview-profile-deletion-switch")
    ).toBeNull();
  });

  // Pending requests keep the toggle ON (even though the UI is disabled).
  it("renders the switch ON when a deletion request is in progress", async () => {
    const { findByTestId } = renderComponentMockStore({
      userDataProcessing: {
        [UserDataProcessingChoiceEnum.DELETE]: pot.some({
          choice: UserDataProcessingChoiceEnum.DELETE,
          status: UserDataProcessingStatusEnum.PENDING,
          version: 1,
          created_at: new Date(),
          updated_at: new Date()
        }),
        [UserDataProcessingChoiceEnum.DOWNLOAD]: pot.none
      }
    });

    const nativeSwitch = await findByTestId(
      "profile-overview-profile-deletion-switch"
    );

    expect(nativeSwitch.props.value).toBe(true);
  });

  // Closed or aborted requests should drop the switch back to the OFF state.
  it("renders the switch OFF when deletion request is closed", async () => {
    const { findByTestId } = renderComponentMockStore({
      userDataProcessing: {
        [UserDataProcessingChoiceEnum.DELETE]: pot.some({
          choice: UserDataProcessingChoiceEnum.DELETE,
          status: UserDataProcessingStatusEnum.CLOSED,
          version: 1,
          created_at: new Date(),
          updated_at: new Date()
        }),
        [UserDataProcessingChoiceEnum.DOWNLOAD]: pot.none
      }
    });

    const nativeSwitch = await findByTestId(
      "profile-overview-profile-deletion-switch"
    );

    expect(nativeSwitch.props.value).toBe(false);
  });
});
