import {
  Body,
  BodySmall,
  ContentWrapper,
  Divider,
  HStack,
  Icon,
  IOColors,
  VStack,
  VSpacer,
  useIOTheme,
  ButtonOutline
} from "@pagopa/io-app-design-system";
import I18n from "i18next";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import * as pot from "@pagopa/ts-commons/lib/pot";

import { ContextualHelpPropsMarkdown } from "../../../../components/screens/BaseScreenComponent";
import { useIODispatch, useIOSelector } from "../../../../store/hooks";
import { FAQsCategoriesType } from "../../../../utils/faq";
import { format } from "../../../../utils/dates";
import { profileOverviewStateSelector } from "../store/selectors";
import { profileOverviewLoad } from "../store/actions";
import { IOScrollViewWithLargeHeader } from "../../../../components/ui/IOScrollViewWithLargeHeader";

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
  const data = pot.isSome(profileOverview) ? profileOverview.value : undefined;

  useEffect(() => {
    dispatch(profileOverviewLoad.request());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(profileOverviewLoad.request());
  }, [dispatch]);

  const shouldShowLoading =
    pot.isNone(profileOverview) ||
    pot.isLoading(profileOverview) ||
    pot.isUpdating(profileOverview);

  const shouldShowError = pot.isError(profileOverview);
  const fallback = I18n.t("global.remoteStates.notAvailable");
  const fullName = [data?.givenName, data?.familyName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const birthDate = data?.birthDate
    ? format(data?.birthDate, "DD/MM/YYYY")
    : fallback;
  // Items to display in the profile page
  const items = [
    {
      id: "fullName",
      icon: "profile" as const,
      title: I18n.t("profile.overview.items.fullName.title"),
      subtitle: fullName.length > 0 ? fullName : fallback,
      testID: "profile-overview-fullname"
    },
    {
      id: "fiscalCode",
      icon: "fiscalCodeIndividual" as const,
      title: I18n.t("profile.overview.items.fiscalCode.title"),
      subtitle: data?.fiscalCode ?? fallback,
      testID: "profile-overview-fiscal-code"
    },
    {
      id: "email",
      icon: "email" as const,
      title: I18n.t("profile.overview.items.email.title"),
      subtitle: data?.email ?? fallback,
      testID: "profile-overview-email"
    },
    {
      id: "birthDate",
      icon: "calendar" as const,
      title: I18n.t("profile.overview.items.birthDate.title"),
      subtitle: birthDate,
      testID: "profile-overview-birth-date"
    }
  ];

  const renderLoading = () => (
    <View style={styles.loadingContainer} accessibilityRole="progressbar">
      <ActivityIndicator
        size="large"
        color={IOColors[theme["interactiveElem-default"]]}
      />
      <VSpacer size={16} />
      <BodySmall color={theme["textBody-tertiary"]}>
        {I18n.t("profile.overview.loading")}
      </BodySmall>
    </View>
  );

  const renderError = () => (
    <ContentWrapper>
      <VStack space={24} style={styles.errorContainer}>
        <Body accessibilityRole="alert">
          {I18n.t("profile.overview.errors.load")}
        </Body>
        <ButtonOutline
          accessibilityLabel={I18n.t("profile.overview.accessibility.retry")}
          label={I18n.t("global.buttons.retry")}
          onPress={handleRetry}
          color="primary"
        />
      </VStack>
    </ContentWrapper>
  );

  const renderItems = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      testID="profile-overview-content"
    >
      <ContentWrapper>
        <VStack space={8}>
          {items.map((item, index) => (
            <View key={item.id} testID={item.testID}>
              <HStack space={16} style={styles.itemContainer}>
                <View
                  style={[
                    styles.iconBadge,
                    {
                      backgroundColor:
                        IOColors[theme["appBackground-secondary"]]
                    }
                  ]}
                >
                  <Icon
                    name={item.icon}
                    color={theme["interactiveElem-default"]}
                    size={24}
                  />
                </View>
                <VStack space={4} style={styles.itemContent}>
                  <BodySmall
                    color={theme["textBody-tertiary"]}
                    weight="Semibold"
                  >
                    {item.title}
                  </BodySmall>
                  <Body color={theme["textBody-default"]}>{item.subtitle}</Body>
                </VStack>
              </HStack>
              {index < items.length - 1 && <Divider />}
            </View>
          ))}
        </VStack>
      </ContentWrapper>
    </ScrollView>
  );

  return (
    <IOScrollViewWithLargeHeader
      title={{
        label: I18n.t("profile.overview.title")
      }}
      description={I18n.t("profile.data.subtitle")}
      headerActionsProp={{ showHelp: true }}
      contextualHelpMarkdown={contextualHelpMarkdown}
      faqCategories={FAQ_CATEGORIES}
    >
      {shouldShowLoading
        ? renderLoading()
        : shouldShowError
        ? renderError()
        : renderItems()}
    </IOScrollViewWithLargeHeader>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainer: {
    flex: 1,
    paddingVertical: 64
  },
  itemContainer: {
    paddingVertical: 16
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  itemContent: {
    flex: 1
  }
});

export default ProfileOverviewScreen;
