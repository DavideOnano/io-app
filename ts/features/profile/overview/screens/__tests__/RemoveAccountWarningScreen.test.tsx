import { fireEvent } from "@testing-library/react-native";
import { createStore } from "redux";
import I18n from "i18next";
import RemoveAccountWarningScreen from "../RemoveAccountWarningScreen";
import { applicationChangeState } from "../../../../../store/actions/application";
import { appReducer } from "../../../../../store/reducers";
import { renderScreenWithNavigationStoreContext } from "../../../../../utils/testWrapper";
import { SETTINGS_ROUTES } from "../../../../settings/common/navigation/routes";

const mockGoBack = jest.fn();

jest.mock("../../../../../navigation/params/AppParamsList", () => ({
  ...jest.requireActual("../../../../../navigation/params/AppParamsList"),
  useIONavigation: () => ({
    goBack: mockGoBack
  })
}));

describe("RemoveAccountWarningScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the warning title, body and alert content", () => {
    const { getAllByText, getByText } = renderComponent();

    expect(
      getAllByText(I18n.t("profile.main.privacy.removeAccount.warning.title"))
        .length
    ).toBeGreaterThanOrEqual(1);
    expect(
      getAllByText(I18n.t("profile.main.privacy.removeAccount.warning.body"))
        .length
    ).toBeGreaterThanOrEqual(1);
    expect(
      getByText(I18n.t("profile.main.privacy.removeAccount.warning.infoBox"))
    ).toBeTruthy();
  });

  it("should call goBack when the cancel action is pressed", () => {
    const { getByText } = renderComponent();

    fireEvent.press(
      getByText(I18n.t("profile.main.privacy.removeAccount.warning.cta.cancel"))
    );

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});

const renderComponent = () => {
  const initialState = appReducer(undefined, applicationChangeState("active"));
  const store = createStore(appReducer, initialState as any);
  return renderScreenWithNavigationStoreContext(
    RemoveAccountWarningScreen,
    SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_WARNING,
    {},
    store
  );
};
