import { ComponentProps, Fragment } from "react";
import {
  ContentWrapper,
  Divider,
  ListItemInfo
} from "@pagopa/io-app-design-system";
import I18n from "i18next";
import { ScrollView, StyleSheet } from "react-native";
import { format } from "../../../../utils/dates";
import { ProfileOverview } from "../store/reducer";

// items to be displayed in the profile overview
export const ProfileItemsView = ({ data }: { data: ProfileOverview }) => {
  const fallback = I18n.t("global.remoteStates.notAvailable");
  const fullName = [data?.givenName, data?.familyName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const birthDate = data?.birthDate
    ? format(data.birthDate, "DD/MM/YYYY")
    : fallback;

  type ProfileListItem = ComponentProps<typeof ListItemInfo> & { id: string };

  const items: ReadonlyArray<ProfileListItem> = [
    {
      id: "fullName",
      icon: "profile",
      label: I18n.t("profile.overview.items.fullName.title"),
      value: fullName.length > 0 ? fullName : fallback,
      testID: "profile-overview-fullname"
    },
    {
      id: "fiscalCode",
      icon: "fiscalCodeIndividual",
      label: I18n.t("profile.overview.items.fiscalCode.title"),
      value: data?.fiscalCode ?? fallback,
      testID: "profile-overview-fiscal-code"
    },
    {
      id: "email",
      icon: "email",
      label: I18n.t("profile.overview.items.email.title"),
      value: data?.email ?? fallback,
      testID: "profile-overview-email"
    },
    {
      id: "birthDate",
      icon: "calendar",
      label: I18n.t("profile.overview.items.birthDate.title"),
      value: birthDate,
      testID: "profile-overview-birth-date"
    }
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      testID="profile-overview-content"
    >
      <ContentWrapper>
        {items.map(({ id, ...itemProps }, index) => (
          <Fragment key={id}>
            <ListItemInfo {...itemProps} />
            {index < items.length - 1 && <Divider />}
          </Fragment>
        ))}
      </ContentWrapper>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: 32 }
});
