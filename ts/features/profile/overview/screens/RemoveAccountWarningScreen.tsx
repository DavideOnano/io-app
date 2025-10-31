import {
  Alert,
  FooterActionsInline,
  VSpacer
} from "@pagopa/io-app-design-system";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import I18n from "i18next";
import { useCallback } from "react";
import { ContextualHelpPropsMarkdown } from "../../../../components/screens/BaseScreenComponent";
import { IOScrollViewWithLargeHeader } from "../../../../components/ui/IOScrollViewWithLargeHeader";
import { useIONavigation } from "../../../../navigation/params/AppParamsList";
import { FAQsCategoriesType } from "../../../../utils/faq";
import { SettingsParamsList } from "../../../settings/common/navigation/params/SettingsParamsList";
import { SETTINGS_ROUTES } from "../../../settings/common/navigation/routes";

export type ProfileRemoveAccountFlowOrigin = "wallet" | "profile";

export type ProfileRemoveAccountFlowParams = Readonly<{
  origin?: ProfileRemoveAccountFlowOrigin;
}>;

type RemoveAccountWarningRouteProps = RouteProp<
  SettingsParamsList,
  typeof SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_WARNING
>;

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "profile.main.privacy.removeAccount.contextualHelpTitle",
  body: "profile.main.privacy.removeAccount.contextualHelpContent"
};

const FAQ_CATEGORIES: ReadonlyArray<FAQsCategoriesType> = [
  "profile",
  "privacy"
];

const RemoveAccountWarningScreen = () => {
  const route = useRoute<RemoveAccountWarningRouteProps>();
  const navigation = useIONavigation();
  const settingsNavigation =
    useNavigation<
      StackNavigationProp<
        SettingsParamsList,
        typeof SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_WARNING
      >
    >();
  const origin = route.params ? route.params.origin : undefined;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleContinue = useCallback(() => {
    settingsNavigation.navigate(
      SETTINGS_ROUTES.PROFILE_REMOVE_ACCOUNT_SUMMARY,
      origin ? { origin } : undefined
    );
  }, [origin, settingsNavigation]);

  return (
    <>
      <IOScrollViewWithLargeHeader
        goBack={handleBack}
        title={{
          label: I18n.t("profile.main.privacy.removeAccount.warning.title")
        }}
        description={I18n.t("profile.main.privacy.removeAccount.warning.body")}
        contextualHelpMarkdown={contextualHelpMarkdown}
        faqCategories={FAQ_CATEGORIES}
        includeContentMargins={true}
        excludeEndContentMargin={true}
        headerActionsProp={{ showHelp: true }}
      >
        <VSpacer size={24} />
        <Alert
          variant="warning"
          content={I18n.t("profile.main.privacy.removeAccount.warning.infoBox")}
          fullWidth={true}
        />
      </IOScrollViewWithLargeHeader>
      <FooterActionsInline
        startAction={{
          label: I18n.t(
            "profile.main.privacy.removeAccount.warning.cta.cancel"
          ),
          onPress: handleBack
        }}
        endAction={{
          label: I18n.t(
            "profile.main.privacy.removeAccount.warning.cta.continue"
          ),
          onPress: handleContinue
        }}
      />
    </>
  );
};

export default RemoveAccountWarningScreen;
