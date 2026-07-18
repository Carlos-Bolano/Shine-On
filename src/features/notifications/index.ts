import { Platform } from "react-native";

export async function scheduleNotifications(
  frequency: number,
  selectedCategories: string[],
  startTime = "08:00 AM",
  endTime = "09:00 PM",
) {
  if (Platform.OS === "web") {
    console.log("Notifications not supported on web");
    return;
  }

  try {
    const Notifications = require("expo-notifications");
    const { MockPhrasesRepository } = require("@/src/core/database/mockPhrasesRepository");

    const repo = new MockPhrasesRepository();

    await Notifications.cancelAllScheduledNotificationsAsync();

    const phrases = await repo.getPhrases(selectedCategories);
    if (!phrases.length) return;

    const [startHour, startMin] = parseTime(startTime);
    const [endHour, endMin] = parseTime(endTime);

    const totalMinutesAvail = endHour * 60 + endMin - (startHour * 60 + startMin);
    const interval = Math.floor(totalMinutesAvail / (frequency + 1));

    for (let i = 0; i < frequency; i++) {
      const minutesSinceStart = interval * (i + 1);
      const totalMinutes = startHour * 60 + startMin + minutesSinceStart;
      const hour = Math.floor(totalMinutes / 60) % 24;
      const minute = totalMinutes % 60;
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Your daily inspiration ✨",
          body: phrase.text,
          data: { phraseId: phrase.id },
        },
        trigger: {
          type: "daily",
          hour,
          minute,
          repeats: true,
        },
      });
    }
  } catch (e) {
    console.error("Error scheduling notifications:", e);
  }
}

function parseTime(timeStr: string): [number, number] {
  const [timePart, period] = timeStr.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);
  let adjustedHours = hours;

  if (period?.includes("PM") && hours !== 12) {
    adjustedHours += 12;
  } else if (period?.includes("AM") && hours === 12) {
    adjustedHours = 0;
  }

  return [adjustedHours, minutes || 0];
}
