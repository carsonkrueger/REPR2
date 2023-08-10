import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import CustomColors from "../../src/util/customColors";

export default function PremiumLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={CustomColors.primary} />
      <Stack screenOptions={{ animation: "none" }}>
        <Stack.Screen name="premium" options={{ headerShown: false }} />
        <Stack.Screen name="purchase" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
