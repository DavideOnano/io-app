import { useIOTheme } from "@pagopa/io-app-design-system";
import I18n from "i18next";
import { useCallback, useEffect } from "react";
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

  useEffect(() => {
    dispatch(profileOverviewLoad.request());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(profileOverviewLoad.request());
  }, [dispatch]);

  const ProfileContent = useCallback(
    () =>
      pot.fold(
        profileOverview,
        () => <LoadingComponent theme={theme} />,
        () => <LoadingComponent theme={theme} />,
        () => <LoadingComponent theme={theme} />,
        () => <ErrorComponent onRetry={handleRetry} />,
        data => <ProfileItemsView data={data} />,
        data => <ProfileItemsView data={data} />,
        (data, _) => <ProfileItemsView data={data} />,
        (data, _) => <ProfileItemsView data={data} />
      ),
    [profileOverview, theme, handleRetry]
  );

  return (
    <IOScrollViewWithLargeHeader
      title={{ label: I18n.t("profile.overview.title") }}
      description={I18n.t("profile.data.subtitle")}
      headerActionsProp={{ showHelp: true }}
      contextualHelpMarkdown={contextualHelpMarkdown}
      faqCategories={FAQ_CATEGORIES}
    >
      <ProfileContent />
    </IOScrollViewWithLargeHeader>
  );
};

export default ProfileOverviewScreen;
