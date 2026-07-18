import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground } from "../../components/GradientBackground";
import { PremiumButton } from "../../components/PremiumButton";
import { Typography } from "../../components/Typography";
import { Storage } from "../../core/storage/storage";
import { BorderRadius, Colors, Gradients, Spacing } from "../../core/theme";

type TimeTarget = "start" | "end";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"] as const;

export default function RhythmScreen() {
  const router = useRouter();
  const [frequency, setFrequency] = useState(3);
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("09:00 PM");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [timeTarget, setTimeTarget] = useState<TimeTarget>("start");
  const [tempHour, setTempHour] = useState(8);
  const [tempMinute, setTempMinute] = useState("00");
  const [tempPeriod, setTempPeriod] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await Storage.getOnboardingSettings();
      if (settings?.selectedCategories) {
        setSelectedCategories(settings.selectedCategories);
      }
    };
    loadSettings();
  }, []);

  const parseTime = (time: string) => {
    const [hourMin, period] = time.split(" ");
    const [h, m] = hourMin.split(":");
    return { hour: parseInt(h, 10), minute: m, period: period as "AM" | "PM" };
  };

  const openTimePicker = (target: TimeTarget) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const t = target === "start" ? startTime : endTime;
    const parsed = parseTime(t);
    setTimeTarget(target);
    setTempHour(parsed.hour);
    setTempMinute(parsed.minute);
    setTempPeriod(parsed.period);
    setTimeModalVisible(true);
  };

  const confirmTime = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const formatted = `${String(tempHour).padStart(2, "0")}:${tempMinute} ${tempPeriod}`;
    if (timeTarget === "start") {
      setStartTime(formatted);
    } else {
      setEndTime(formatted);
    }
    setTimeModalVisible(false);
  };

  const handleContinue = async () => {
    if (Platform.OS !== "web") {
      try {
        const Notifications = require("expo-notifications");
        const { scheduleNotifications } = require("../../features/notifications");
        const { status } = await Notifications.requestPermissionsAsync();

        await Storage.saveOnboardingSettings({
          hasCompletedOnboarding: true,
          frequency,
          startTime,
          endTime,
        });

        if (status === "granted") {
          await scheduleNotifications(frequency, selectedCategories, startTime, endTime);
        }
      } catch (e) {
        console.error("Error setting up notifications:", e);
        await Storage.saveOnboardingSettings({
          hasCompletedOnboarding: true,
          frequency,
          startTime,
          endTime,
        });
      }
    } else {
      await Storage.saveOnboardingSettings({
        hasCompletedOnboarding: true,
        frequency,
        startTime,
        endTime,
      });
    }

    router.replace("/feed");
  };

  return (
    <GradientBackground colors={Gradients.pastel}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.slate[900]} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="notifications-active" size={40} color={Colors.primary} />
              </View>
              <Typography size="3xl" weight="extrabold" style={styles.title}>
                How often should we inspire you?
              </Typography>
              <Typography size="base" color={Colors.slate[600]} style={styles.subtitle}>
                Choose your daily frequency and active hours for personalized motivation.
              </Typography>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Typography size="base" weight="medium">
                  Frequency
                </Typography>
                <View style={styles.frequencyBadge}>
                  <Typography size="sm" weight="bold" color={Colors.primary}>
                    {frequency} times per day
                  </Typography>
                </View>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${((frequency - 1) / 4) * 100}%` }]} />
                </View>
                <View style={styles.sliderThumbs}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.thumbOption,
                        frequency >= val && styles.thumbOptionFilled,
                        frequency === val && styles.thumbOptionActive,
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setFrequency(val);
                      }}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.sliderLabels}>
                <Typography size="xs" weight="medium" color={Colors.slate[500]}>
                  1 time
                </Typography>
                <Typography size="xs" weight="medium" color={Colors.slate[500]}>
                  5 times
                </Typography>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Typography size="lg" weight="bold">
                Active hours
              </Typography>
            </View>

            <View style={styles.card}>
              <View style={styles.timeRow}>
                <TouchableOpacity style={styles.timeBox} onPress={() => openTimePicker("start")}>
                  <Typography size="xs" weight="bold" color={Colors.slate[500]} style={styles.timeLabel}>
                    From
                  </Typography>
                  <View style={styles.timeValue}>
                    <Typography size="xl" weight="bold">
                      {startTime}
                    </Typography>
                  </View>
                </TouchableOpacity>
                <View style={styles.arrowIcon}>
                  <MaterialIcons name="arrow-forward" size={24} color={Colors.slate[400]} />
                </View>
                <TouchableOpacity style={styles.timeBox} onPress={() => openTimePicker("end")}>
                  <Typography size="xs" weight="bold" color={Colors.slate[500]} style={styles.timeLabel}>
                    Until
                  </Typography>
                  <View style={styles.timeValue}>
                    <Typography size="xl" weight="bold">
                      {endTime}
                    </Typography>
                  </View>
                </TouchableOpacity>
              </View>

              <Typography size="sm" color={Colors.slate[500]} style={styles.hint}>
                Shine will only send quotes during this time
              </Typography>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <PremiumButton title="Start shining" onPress={handleContinue} />
          </View>
        </View>
      </SafeAreaView>

      <Modal visible={timeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typography size="xl" weight="bold" style={styles.modalTitle}>
              Select {timeTarget === "start" ? "Start " : "End "} Time
            </Typography>

            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                <Typography size="xs" weight="bold" color={Colors.slate[500]} style={styles.pickerLabel}>
                  HOUR
                </Typography>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {HOURS.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.pickerOption, tempHour === h && styles.pickerOptionActive]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setTempHour(h);
                      }}
                    >
                      <Typography size="lg" weight="bold" color={tempHour === h ? "#fff" : Colors.slate[700]}>
                        {String(h).padStart(2, "0")}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Typography size="xs" weight="bold" color={Colors.slate[500]} style={styles.pickerLabel}>
                  MIN
                </Typography>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {MINUTES.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.pickerOption, tempMinute === m && styles.pickerOptionActive]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setTempMinute(m);
                      }}
                    >
                      <Typography
                        size="lg"
                        weight="bold"
                        color={tempMinute === m ? "#fff" : Colors.slate[700]}
                      >
                        {m}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Typography size="xs" weight="bold" color={Colors.slate[500]} style={styles.pickerLabel}>
                  PERIOD
                </Typography>
                {PERIODS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pickerOption, tempPeriod === p && styles.pickerOptionActive]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setTempPeriod(p);
                    }}
                  >
                    <Typography size="lg" weight="bold" color={tempPeriod === p ? "#fff" : Colors.slate[700]}>
                      {p}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setTimeModalVisible(false)}>
                <Typography size="base" weight="medium" color={Colors.slate[600]}>
                  Cancel
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={confirmTime}>
                <Typography size="base" weight="bold" color="#fff">
                  Confirm
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 150,
  },
  headerContent: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.md,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: BorderRadius.default,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  frequencyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(238, 95, 43, 0.1)",
  },
  sliderContainer: {
    paddingVertical: Spacing.md,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "rgba(148, 163, 184, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  sliderThumbs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -16,
  },
  thumbOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.slate[300],
  },
  thumbOptionFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  thumbOptionActive: {
    backgroundColor: "#fff",
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  timeBox: {
    flex: 1,
  },
  timeLabel: {
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  timeValue: {
    backgroundColor: "#fff",
    borderRadius: BorderRadius.default,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.slate[200],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  arrowIcon: {
    paddingTop: 24,
  },
  hint: {
    textAlign: "center",
    marginTop: Spacing.lg,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  pickerRow: {
    flexDirection: "row",
    gap: Spacing.md,
    height: 280,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerOption: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  pickerOptionActive: {
    backgroundColor: Colors.primary,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.slate[100],
    alignItems: "center",
    justifyContent: "center",
  },
  modalConfirm: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
