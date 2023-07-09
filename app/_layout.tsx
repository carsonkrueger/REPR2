import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "../src/redux/store";

export default function Layout() {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="#fff" style="dark" />
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            animation: "slide_from_left",
          }}
        />
        <Stack.Screen
          name="signup"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
