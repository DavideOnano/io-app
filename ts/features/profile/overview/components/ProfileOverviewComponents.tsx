import {
  Body,
  BodySmall,
  ContentWrapper,
  IOColors,
  VStack,
  VSpacer,
  useIOTheme,
  ButtonOutline
} from "@pagopa/io-app-design-system";
import I18n from "i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export const LoadingComponent = ({
  theme
}: {
  theme: ReturnType<typeof useIOTheme>;
}) => (
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

export const ErrorComponent = ({ onRetry }: { onRetry: () => void }) => (
  <ContentWrapper>
    <VStack space={24} style={styles.errorContainer}>
      <Body accessibilityRole="alert">
        {I18n.t("profile.overview.errors.load")}
      </Body>
      <ButtonOutline
        accessibilityLabel={I18n.t("profile.overview.accessibility.retry")}
        label={I18n.t("global.buttons.retry")}
        onPress={onRetry}
        color="primary"
      />
    </VStack>
  </ContentWrapper>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center"
  },
  errorContainer: { flex: 1, paddingVertical: 64 }
});
