import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../../components/GradientBackground";
import { Typography } from "../../components/Typography";
import { Storage } from "../../core/storage/storage";
import { BorderRadius, Colors, Spacing } from "../../core/theme";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  // const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const load = async () => {
      const settings = await Storage.getOnboardingSettings();
      setUserName(settings?.userName ?? "");
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Typography size="sm" weight="medium" color={Colors.slate[500]}>
              {getGreeting()}
            </Typography>
            <Typography size="2xl" weight="bold">
              {userName || "Welcome"}
            </Typography>
          </View>
        </View>

        <GradientBackground colors={Gradients.dopamine} style={styles.heroCard}>
          <MaterialIcons name="auto-awesome" size={24} color={Colors.primary} />
          <Typography size="xs" weight="bold" color={Colors.primary} style={styles.heroLabel}>
            QUOTE OF THE DAY
          </Typography>
          <Typography variant="serif" size="2xl" weight="regular" italic style={styles.heroQuote}>
            {"\u201C"}The only way to do great work is to love what you do.{"\u201D"}
          </Typography>
          <Typography size="sm" weight="medium" color={Colors.slate[600]}>
            — Steve Jobs
          </Typography>
        </GradientBackground>

        <View style={styles.section}>
          <Typography size="lg" weight="bold" style={styles.sectionTitle}>
            Daily Light Map
          </Typography>
          <View style={styles.streakContainer}>
            {Array.from({ length: 7 }).map((_, i) => (
              <View key={i} style={[styles.streakDot, i < 3 && styles.streakDotActive]} />
            ))}
          </View>
          <Typography size="xs" weight="medium" color={Colors.slate[500]}>
            3 active days this week
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Gradients = {
  dopamine: ["#f8f6f6", "#ffedd5", "#fed7aa", "#fecaca", "#f8f6f6"],
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  container: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    gap: Spacing.md,
  },
  heroLabel: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroQuote: {
    textAlign: "center",
    lineHeight: 36,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.xs,
  },
  streakContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  streakDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.slate[200],
  },
  streakDotActive: {
    backgroundColor: Colors.primary,
  },
});
