import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "../src/redux/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Stack screenOptions={{ animation: "fade" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="singup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
