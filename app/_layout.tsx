import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "../src/redux/store";
import TabNavigator from "../src/components/navComponents/Nav";

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Stack screenOptions={{ animation: "fade" }}>
        <Stack.Screen
          name="index"
          options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="home"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="search"
          options={{ title: "Search", headerShown: false }}
        />
        <Stack.Screen
          name="workouts"
          options={{ title: "Workouts", headerShown: false }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Settings", headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "Profile", headerShown: false }}
        />
        <Stack.Screen
          name="(workout)/[workoutId]"
          options={{ headerShown: false }}
        />
      </Stack>
      <TabNavigator />
    </Provider>
  );
}
