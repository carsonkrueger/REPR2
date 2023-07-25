import React from "react";
import { TouchableOpacity } from "react-native";
import CustomColors from "../util/customColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PremiumIcon() {
  const router = useRouter();

  function pushNavigateToPremium() {
    router.push("premium");
  }

  return (
    <TouchableOpacity onPress={pushNavigateToPremium}>
      <MaterialCommunityIcons
        name="crown"
        color={CustomColors.gold}
        size={27}
      />
    </TouchableOpacity>
  );
}
