import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../../components/GradientBackground";
import { PremiumButton } from "../../components/PremiumButton";
import { Typography } from "../../components/Typography";
import { Colors, Spacing } from "../../core/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="wb-sunny" size={50} color={Colors.primary} />
            </View>

            <Typography variant="lora" size="4xl" weight="bold" style={styles.title}>
              A ray of light{"\n"}
              <Typography variant="lora" size="4xl" italic={true} style={styles.titleItalic}>
                for your day ✨
              </Typography>
            </Typography>

            <Typography size="lg" color={Colors.slate[600]} style={styles.subtitle}>
              Welcome to Shine On, where every quote is a step towards a brighter you.
            </Typography>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.indicators}>
              <View style={[styles.indicator, styles.activeIndicator]} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
            </View>

            <PremiumButton title="Continue" onPress={() => router.push("/onboarding/profile")} />
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
    paddingVertical: Spacing.xxl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 86,
    height: 86,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: "center",
    lineHeight: 48,
  },
  titleItalic: {
    color: Colors.primary,
    lineHeight: 51,
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.lg,
    maxWidth: 250,
    lineHeight: 24,
  },
  bottomSection: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  indicators: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(238, 95, 43, 0.2)",
  },
  activeIndicator: {
    width: 32,
    backgroundColor: Colors.primary,
  },
});
