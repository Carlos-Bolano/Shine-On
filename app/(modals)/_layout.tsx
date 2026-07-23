import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        animation: "slide_from_bottom",
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="settings" />
      <Stack.Screen name="customizer" />
    </Stack>
  );
}
