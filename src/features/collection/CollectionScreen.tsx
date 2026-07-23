import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/Typography";
import { Colors, Spacing } from "../../core/theme";

type Tab = "saved" | "creations";

export default function CollectionScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("saved");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography size="2xl" weight="bold">
            My Collection
          </Typography>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "saved" && styles.tabActive]}
            onPress={() => {
              setActiveTab("saved");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Typography
              size="base"
              weight={activeTab === "saved" ? "bold" : "medium"}
              color={activeTab === "saved" ? Colors.primary : Colors.slate[500]}
            >
              Saved Quotes
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "creations" && styles.tabActive]}
            onPress={() => {
              setActiveTab("creations");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Typography
              size="base"
              weight={activeTab === "creations" ? "bold" : "medium"}
              color={activeTab === "creations" ? Colors.primary : Colors.slate[500]}
            >
              My Creations
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <MaterialIcons
            name={activeTab === "saved" ? "favorite-border" : "palette"}
            size={64}
            color={Colors.slate[300]}
          />
          <Typography size="lg" weight="medium" color={Colors.slate[500]}>
            {activeTab === "saved" ? "No saved quotes yet" : "No creations yet"}
          </Typography>
          <Typography size="sm" weight="medium" color={Colors.slate[400]}>
            {activeTab === "saved"
              ? "Tap the heart on any quote to save it here"
              : "Use the customizer to create your own"}
          </Typography>
        </View>

        <TouchableOpacity style={styles.fab} onPress={() => router.push("/customizer")} activeOpacity={0.8}>
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[200],
  },
  tab: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  fab: {
    position: "absolute",
    right: Spacing.lg,
    bottom: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
