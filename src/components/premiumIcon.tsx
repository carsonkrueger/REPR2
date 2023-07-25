import React from "react";
import { TouchableOpacity } from "react-native";
import CustomColors from "../util/customColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { selectIsPremium } from "../redux/slices/profileSlice";

export default function PremiumIcon() {
  const router = useRouter();
  const isPremium = useSelector((state: RootState) => selectIsPremium(state));

  function pushNavigateToPremium() {
    router.push("premium");
  }

  if (isPremium) return null;

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
