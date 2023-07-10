import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { selectProfile } from "../../src/redux/slices/profileSlice";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => selectProfile(state));

  function navigateToSettings() {
    router.push("settings");
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View style={tw`flex-row px-3 py-2 bg-front shadow-md justify-between`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {profile.username}
        </Text>
        <TouchableOpacity
          style={tw`flex-col justify-end items-center pb-1`}
          onPress={navigateToSettings}
        >
          <Ionicons
            name={"settings-outline"}
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
