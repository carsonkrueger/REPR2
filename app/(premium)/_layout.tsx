import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import CustomColors from "../../src/util/customColors";

export default function PremiumLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={CustomColors.primary} />
      <Stack screenOptions={{ animation: "slide_from_bottom" }}>
        <Stack.Screen name="premium" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
