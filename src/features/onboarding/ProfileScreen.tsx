import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { GradientBackground } from "../../components/GradientBackground";
import { Input } from "../../components/Input";
import { PremiumButton } from "../../components/PremiumButton";
import { Typography } from "../../components/Typography";
import { Storage } from "../../core/storage/storage";
import { Colors, Gradients, Spacing } from "../../core/theme";

const profileSchema = z.object({
  name: z.string().min(1, "Please enter your name").max(50, "Maximum 50 characters"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Storage.saveOnboardingSettings({
      userName: data.name,
      userEmail: data.email || undefined,
    });
    router.push("/onboarding/categories");
  };

  return (
    <GradientBackground colors={Gradients.dopamine}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.slate[900]} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={40} color={Colors.primary} />
            </View>

            <Typography size="3xl" weight="extrabold" style={styles.title}>
              Nice to meet you! What’s your name?
            </Typography>

            <Typography size="base" color={Colors.slate[600]} style={styles.subtitle}>
              We&apos;ll use your name to personalize your quotes and keep you inspired every day.
            </Typography>

            <View style={styles.form}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    autoFocus={true}
                    label="Name"
                    placeholder="Enter your name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                    autoCapitalize="words"
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email (optional)"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              <Typography size="sm" color={Colors.slate[600]} style={styles.emailText}>
                Its optional. It will be use to send you updates and tips.
              </Typography>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.indicators}>
              <View style={[styles.indicator, styles.activeIndicator]} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
              <View style={styles.indicator} />
            </View>

            <PremiumButton title="Continue" onPress={handleSubmit(onSubmit)} />
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
    paddingBottom: 20,
  },
  header: {
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
  content: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    textAlign: "center",
    lineHeight: 40,
  },
  titleItalic: {
    color: Colors.primary,
    lineHeight: 47,
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.md,
  },
  emailText: {
    paddingLeft: Spacing.sm,
    marginTop: -Spacing.sm,
  },
  form: {
    width: "100%",
    gap: Spacing.md,
    marginTop: Spacing.lg,
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
