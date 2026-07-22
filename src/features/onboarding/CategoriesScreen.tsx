import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PremiumButton } from "../../components/PremiumButton";
import { Typography } from "../../components/Typography";
import { MockPhrasesRepository } from "../../core/database/mockPhrasesRepository";
import { Category } from "../../core/database/types";
import { Storage } from "../../core/storage/storage";
import { BorderRadius, Colors, Spacing } from "../../core/theme";

const repository = new MockPhrasesRepository();

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const scaleAnims = React.useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    const load = async () => {
      const cats = await repository.getCategories();
      setCategories(cats);
      cats.forEach((cat) => {
        scaleAnims.current[cat.id] = new Animated.Value(1);
      });
    };
    load();
  }, []);

  const toggleCategory = async (categoryId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const scaleAnim = scaleAnims.current[categoryId];
    if (scaleAnim) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
      ]).start();
    }

    setSelected((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleContinue = async () => {
    await Storage.saveOnboardingSettings({ selectedCategories: selected });
    router.push("/onboarding/rhythm");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.slate[900]} />
          </TouchableOpacity>
          <Typography size="sm" weight="bold" color={Colors.slate[600]} style={styles.stepText}>
            Step 3 of 4
          </Typography>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.titleSection}>
          <Typography size="3xl" weight="bold" style={styles.title}>
            What lights you up?
          </Typography>
          <Typography size="base" color={Colors.slate[500]} style={styles.subtitle}>
            Select the categories where you&apos;d like to see daily inspiration.
          </Typography>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.grid}>
            {categories.map((cat) => {
              const isSelected = selected.includes(cat.id);
              const scale = scaleAnims.current[cat.id] || new Animated.Value(1);
              return (
                <Animated.View key={cat.id} style={[styles.gridItem, { transform: [{ scale }] }]}>
                  <TouchableOpacity
                    style={[styles.card, isSelected && styles.selectedCard]}
                    onPress={() => toggleCategory(cat.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconCircle, { backgroundColor: cat.colorLight }]}>
                      <MaterialIcons name={cat.icon as any} size={36} color={cat.iconColor} />
                    </View>
                    <Typography size="base" weight="bold">
                      {cat.name}
                    </Typography>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <MaterialIcons name="check" size={14} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.indicators}>
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
          </View>
          <PremiumButton title="Continue Journey" onPress={handleContinue} disabled={selected.length === 0} />
        </View>
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
    paddingTop: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepText: {
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    lineHeight: 40,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 180,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: "47%",
  },
  card: {
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: BorderRadius.default,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.background.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
  indicators: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.slate[300],
  },
  activeIndicator: {
    width: 32,
    backgroundColor: Colors.primary,
  },
});
