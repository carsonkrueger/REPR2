import { Stack } from "expo-router";

import TabNavigator from "../../src/components/navComponents/Nav";

export default function TabLayout() {
  return (
    <>
      <Stack screenOptions={{ animation: "fade" }}>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="workouts" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout/[workoutId]"
          options={{ headerShown: false }}
        />
      </Stack>
      <TabNavigator />
    </>
  );
}
