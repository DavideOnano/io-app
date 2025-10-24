import {
  ContentWrapper,
  ListItemSwitch,
  VSpacer,
  useIOTheme
} from "@pagopa/io-app-design-system";
import I18n from "i18next";
import { useCallback, useEffect, useMemo } from "react";
import * as pot from "@pagopa/ts-commons/lib/pot";
import { ContextualHelpPropsMarkdown } from "../../../../components/screens/BaseScreenComponent";
import { useIODispatch, useIOSelector } from "../../../../store/hooks";
import { FAQsCategoriesType } from "../../../../utils/faq";
import { profileOverviewStateSelector } from "../store/selectors";
import { profileOverviewLoad } from "../store/actions";
import { IOScrollViewWithLargeHeader } from "../../../../components/ui/IOScrollViewWithLargeHeader";
import {
  ErrorComponent,
  LoadingComponent
} from "../components/ProfileOverviewComponents";
import { ProfileItemsView } from "../components/ProfileItemsView";
import { UserDataProcessingChoiceEnum } from "../../../../../definitions/backend/UserDataProcessingChoice";
import { loadUserDataProcessing } from "../../../settings/common/store/actions/userDataProcessing";
import {
  isUserDataProcessingDeleteLoadingSelector,
  userDataProcessingSelector
} from "../../../settings/common/store/selectors/userDataProcessing";
import { UserDataProcessingStatusEnum } from "../../../../../definitions/backend/UserDataProcessingStatus";

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "profile.overview.contextualHelpTitle",
  body: "profile.overview.contextualHelpContent"
};

const FAQ_CATEGORIES: ReadonlyArray<FAQsCategoriesType> = [
  "profile",
  "privacy",
  "authentication_SPID"
];

const ProfileOverviewScreen = () => {
  const dispatch = useIODispatch();
  const theme = useIOTheme();
  const profileOverview = useIOSelector(profileOverviewStateSelector);
  const deleteChoice = UserDataProcessingChoiceEnum.DELETE;
  const userDataProcessing = useIOSelector(userDataProcessingSelector);
  const deleteRequestState = userDataProcessing[deleteChoice];
  const isDeleteLoading = useIOSelector(
    isUserDataProcessingDeleteLoadingSelector
  );

  // Determine if profile deletion has been requested
  const isProfileDeletionRequested = useMemo(
    () =>
      pot.getOrElse(
        pot.map(
          deleteRequestState,
          value =>
            value !== undefined &&
            value.status !== UserDataProcessingStatusEnum.CLOSED &&
            value.status !== UserDataProcessingStatusEnum.ABORTED
        ),
        false
      ),
    [deleteRequestState]
  );

  const shouldShowDeletionSpinner =
    isDeleteLoading || pot.isNone(deleteRequestState);

  const loadProfile = useCallback(() => {
    dispatch(profileOverviewLoad.request());
    dispatch(loadUserDataProcessing.request(deleteChoice));
  }, [dispatch, deleteChoice]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const ProfileContent = useCallback(
    () =>
      pot.fold(
        profileOverview,
        () => <LoadingComponent theme={theme} />,
        () => <LoadingComponent theme={theme} />,
        () => <LoadingComponent theme={theme} />,
        () => <ErrorComponent onRetry={loadProfile} />,
        data => <ProfileItemsView data={data} />,
        data => <ProfileItemsView data={data} />,
        (data, _) => <ProfileItemsView data={data} />,
        (data, _) => <ProfileItemsView data={data} />
      ),
    [profileOverview, theme, loadProfile]
  );

  return (
    <IOScrollViewWithLargeHeader
      title={{ label: I18n.t("profile.overview.title") }}
      description={I18n.t("profile.data.subtitle")}
      headerActionsProp={{ showHelp: true }}
      contextualHelpMarkdown={contextualHelpMarkdown}
      faqCategories={FAQ_CATEGORIES}
    >
      <ContentWrapper>
        <ListItemSwitch
          testID="profile-overview-profile-deletion"
          label={I18n.t("profile.main.privacy.removeAccount.title")}
          value={isProfileDeletionRequested}
          isLoading={shouldShowDeletionSpinner}
          // TODO add disable logic when profile deletion feature is implemented, atm is always
          disabled={true}
          onSwitchValueChange={() => undefined}
        />
      </ContentWrapper>
      <VSpacer size={16} />
      <ProfileContent />
    </IOScrollViewWithLargeHeader>
  );
};

export default ProfileOverviewScreen;
