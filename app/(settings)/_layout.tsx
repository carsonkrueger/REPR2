import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function SettingsLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Stack screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}