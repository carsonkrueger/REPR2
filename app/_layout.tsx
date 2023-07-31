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
          }}
        />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="(premium)" options={{ headerShown: false }} />
        <Stack.Screen name="post/createPost" options={{ headerShown: false }} />
        <Stack.Screen name="post/[postId]" options={{ headerShown: false }} />
        <Stack.Screen
          name="(exercise search)"
          options={{ headerShown: false }}
        />
      </Stack>
    </Provider>
  );
}
