import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "../src/redux/store";
import TabNavigator from "../src/components/Nav";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
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
          name="(workout)/[workoutId]"
          options={{ headerShown: false }}
        />
      </Stack>
      <TabNavigator />
    </Provider>
  );
}
