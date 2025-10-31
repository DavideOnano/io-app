import {
  FooterActionsInline,
  FooterActionsInlineMeasurements,
  useIOTheme,
  useIOToast
} from "@pagopa/io-app-design-system";
import * as pot from "@pagopa/ts-commons/lib/pot";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import I18n from "i18next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useHardwareBackButton } from "../../../../hooks/useHardwareBackButton";
import { useIONavigation } from "../../../../navigation/params/AppParamsList";
import ROUTES from "../../../../navigation/routes";
import { useIODispatch, useIOSelector } from "../../../../store/hooks";
import { ContextualHelpPropsMarkdown } from "../../../../components/screens/BaseScreenComponent";
import { FAQsCategoriesType } from "../../../../utils/faq";
import { SettingsParamsList } from "../../common/navigation/params/SettingsParamsList";
import { SETTINGS_ROUTES } from "../../common/navigation/routes";
import {
  resetUserDataProcessingRequest,
  upsertUserDataProcessing
} from "../../common/store/actions/userDataProcessing";
import { userDataProcessingSelector } from "../../common/store/selectors/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../../../definitions/backend/UserDataProcessingChoice";
import { profileOverviewLoad } from "../../../profile/overview/store/actions";
import { profileOverviewStateSelector } from "../../../profile/overview/store/selectors";
import {
  ErrorComponent,
  LoadingComponent
} from "../../../profile/overview/components/ProfileOverviewComponents";
import { ProfileItemsView } from "../../../profile/overview/components/ProfileItemsView";
import { IOScrollViewWithLargeHeader } from "../../../../components/ui/IOScrollViewWithLargeHeader";
import { ProfileRemoveAccountFlowOrigin } from "./RemoveAccountWarningScreen";

type RemoveAccountSummaryRouteProps = RouteProp<
  SettingsParamsList,
  typeof SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_SUMMARY
>;

const SUMMARY_CONTEXTUAL_HELP: ContextualHelpPropsMarkdown = {
  title: "profile.main.privacy.removeAccount.title",
  body: "profile.main.privacy.privacyPolicy.contextualHelpContent"
};

const FAQ_CATEGORIES: ReadonlyArray<FAQsCategoriesType> = [
  "profile",
  "privacy"
];

const RemoveAccountSummaryScreen = () => {
  const route = useRoute<RemoveAccountSummaryRouteProps>();
  const settingsNavigation =
    useNavigation<
      StackNavigationProp<
        SettingsParamsList,
        typeof SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_SUMMARY
      >
    >();
  const mainNavigation = useIONavigation();
  const dispatch = useIODispatch();
  const toast = useIOToast();
  const theme = useIOTheme();

  const origin = route.params ? route.params.origin : undefined;
  const [safeBottomAreaHeight, setSafeBottomAreaHeight] = useState(0);

  const userDataProcessing = useIOSelector(userDataProcessingSelector);
  const deleteChoice = UserDataProcessingChoiceEnum.DELETE;
  const deleteState = userDataProcessing[deleteChoice];
  const isSubmitting =
    pot.isLoading(deleteState) || pot.isUpdating(deleteState);
  const hasSubmitted = useRef(isSubmitting);

  const profileOverviewState = useIOSelector(profileOverviewStateSelector);
  const hasLoadedProfileData =
    pot.isSome(profileOverviewState) || pot.isUpdating(profileOverviewState);
  const shouldLoadProfileOverview = pot.isNone(profileOverviewState);

  useEffect(() => {
    if (shouldLoadProfileOverview) {
      dispatch(profileOverviewLoad.request());
    }

    return () => {
      dispatch(resetUserDataProcessingRequest(deleteChoice));
    };
  }, [dispatch, shouldLoadProfileOverview, deleteChoice]);

  useEffect(() => {
    // Track submission deleting state to detect when it chnges
    const submittedRef = hasSubmitted.current;
    if (submittedRef && !isSubmitting) {
      if (pot.isSome(deleteState) && !pot.isError(deleteState)) {
        settingsNavigation.replace(
          SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_SUCCESS,
          origin ? { origin } : undefined
        );
      } else if (pot.isError(deleteState)) {
        toast.error(
          I18n.t("profile.main.privacy.removeAccount.summary.errorMessage")
        );
      }
    }
  }, [deleteState, isSubmitting, origin, settingsNavigation, toast]);

  const handleGoBack = useCallback(() => {
    settingsNavigation.goBack();
  }, [settingsNavigation]);

  const handleCancel = useCallback(() => {
    const exitHandlers: Record<
      NonNullable<ProfileRemoveAccountFlowOrigin>,
      () => void
    > = {
      // Map of possible origins
      wallet: () =>
        mainNavigation.navigate(ROUTES.MAIN, {
          screen: ROUTES.WALLET_HOME,
          params: {}
        }),
      profile: () =>
        mainNavigation.navigate(SETTINGS_ROUTES.PROFILE_NAVIGATOR, {
          screen: SETTINGS_ROUTES.PROFILE_DATA
        })
    };

    exitHandlers[origin ?? "wallet"]();
  }, [origin, mainNavigation]);

  const handleSubmit = useCallback(() => {
    if (!isSubmitting && hasLoadedProfileData) {
      dispatch(upsertUserDataProcessing.request(deleteChoice));
    }
  }, [dispatch, deleteChoice, isSubmitting, hasLoadedProfileData]);

  const handleProfileReload = useCallback(() => {
    dispatch(profileOverviewLoad.request());
  }, [dispatch]);

  const summaryContent = useMemo(
    () =>
      pot.fold(
        profileOverviewState,
        () => <LoadingComponent theme={theme} />,
        () => <LoadingComponent theme={theme} />,
        () => <LoadingComponent theme={theme} />,
        () => <ErrorComponent onRetry={handleProfileReload} />,
        data => <ProfileItemsView data={data} />,
        data => <ProfileItemsView data={data} />,
        (data, _) => <ProfileItemsView data={data} />,
        (data, _) => <ProfileItemsView data={data} />
      ),
    [profileOverviewState, theme, handleProfileReload]
  );

  const handleFooterMeasurements = useCallback(
    ({ safeBottomAreaHeight: safeBottom }: FooterActionsInlineMeasurements) => {
      setSafeBottomAreaHeight(safeBottom);
    },
    []
  );

  useHardwareBackButton(() => {
    handleGoBack();
    return true;
  });

  const isContinueDisabled = isSubmitting || !hasLoadedProfileData;

  return (
    <View style={{ flex: 1 }}>
      <IOScrollViewWithLargeHeader
        goBack={handleGoBack}
        title={{
          label: I18n.t("profile.main.privacy.removeAccount.summary.title")
        }}
        description={I18n.t(
          "profile.main.privacy.removeAccount.summary.description"
        )}
        contextualHelpMarkdown={SUMMARY_CONTEXTUAL_HELP}
        faqCategories={FAQ_CATEGORIES}
        includeContentMargins
        excludeEndContentMargin
        headerActionsProp={{ showHelp: true }}
      >
        <View style={{ flex: 1, paddingBottom: safeBottomAreaHeight }}>
          {summaryContent}
        </View>
      </IOScrollViewWithLargeHeader>

      <FooterActionsInline
        onMeasure={handleFooterMeasurements}
        startAction={{
          label: I18n.t(
            "profile.main.privacy.removeAccount.summary.cta.cancel"
          ),
          onPress: handleCancel,
          disabled: isSubmitting
        }}
        endAction={{
          label: I18n.t(
            "profile.main.privacy.removeAccount.summary.cta.continue"
          ),
          onPress: handleSubmit,
          loading: isSubmitting,
          disabled: isContinueDisabled,
          color: "danger"
        }}
      />
    </View>
  );
};

export default RemoveAccountSummaryScreen;
