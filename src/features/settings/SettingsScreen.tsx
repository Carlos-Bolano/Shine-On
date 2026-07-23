import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/Typography";
import { Storage } from "../../core/storage/storage";
import { BorderRadius, Colors, Spacing } from "../../core/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState<"es" | "en">("en");

  useEffect(() => {
    const load = async () => {
      const settings = await Storage.getOnboardingSettings();
    };
    load();
  }, []);

  const toggleLanguage = async () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    await Storage.saveOnboardingSettings({ language: newLang } as any);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios-new" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Typography size="lg" weight="bold">
            Settings
          </Typography>
          <View style={styles.backButton} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Typography size="sm" weight="bold" color={Colors.slate[500]} style={styles.sectionLabel}>
              GENERAL
            </Typography>

            <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="language" size={22} color={Colors.primary} />
                <Typography size="base" weight="medium">
                  Language
                </Typography>
              </View>
              <View style={styles.rowRight}>
                <Typography size="base" weight="medium" color={Colors.slate[500]}>
                  {language === "en" ? "English" : "Espa\u00f1ol"}
                </Typography>
                <MaterialIcons name="chevron-right" size={20} color={Colors.slate[400]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="notifications-none" size={22} color={Colors.primary} />
                <Typography size="base" weight="medium">
                  Notifications
                </Typography>
              </View>
              <View style={styles.rowRight}>
                <MaterialIcons name="chevron-right" size={20} color={Colors.slate[400]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="schedule" size={22} color={Colors.primary} />
                <Typography size="base" weight="medium">
                  Active Hours
                </Typography>
              </View>
              <View style={styles.rowRight}>
                <MaterialIcons name="chevron-right" size={20} color={Colors.slate[400]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Typography size="sm" weight="bold" color={Colors.slate[500]} style={styles.sectionLabel}>
              PROFILE
            </Typography>

            <TouchableOpacity style={styles.row}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="person-outline" size={22} color={Colors.primary} />
                <Typography size="base" weight="medium">
                  Edit Profile
                </Typography>
              </View>
              <View style={styles.rowRight}>
                <MaterialIcons name="chevron-right" size={20} color={Colors.slate[400]} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(238, 95, 43, 0.1)",
    backgroundColor: "rgba(248, 246, 246, 0.8)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: "#fff",
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
});
