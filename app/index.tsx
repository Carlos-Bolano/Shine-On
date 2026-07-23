import { Storage } from "@/src/core/storage/storage";
import { Colors } from "@/src/core/theme";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboarding = async () => {
      const settings = await Storage.getOnboardingSettings();
      const inOnboarding = segments[0] === "(onboarding)";

      if (settings?.hasCompletedOnboarding) {
        router.replace("/(tabs)/feed");
      } else if (!inOnboarding) {
        router.replace("/(onboarding)/welcome");
      }
    };

    checkOnboarding();
  }, [router, segments]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background.light,
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
