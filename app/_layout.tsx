import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "../src/redux/store";
import Nav from "../src/components/Nav";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="workouts" options={{ title: "Workouts" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="[workoutId]" />
      </Stack>
      <Nav />
    </Provider>
  );
}
