import { Stack } from "expo-router";

import TabNavigator from "../../src/components/navComponents/Nav";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="#fff" />
      <Stack screenOptions={{ animation: "fade" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="workouts" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout/[workoutId]"
          options={{ headerShown: false, animation: "fade" }}
        />
      </Stack>
      <TabNavigator />
    </>
  );
}
