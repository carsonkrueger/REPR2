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
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* TOP HEADER */}
      <View style={tw`flex-row px-4 py-3 justify-between`}>
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

      {/* PROFILE ICON AREA*/}
      <View style={tw`flex-row pb-5 justify-evenly items-center`}>
        <View
          style={tw`border-[1px] border-light-gray rounded-full h-22 w-22`}
        />
        <View style={tw`flex-col`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            5
          </Text>
          <Text
            style={[
              tw`text-dark-gray text-center`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Posts
          </Text>
        </View>
        <View style={tw`flex-col`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            562
          </Text>
          <Text
            style={[
              tw`text-dark-gray text-center`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Followers
          </Text>
        </View>
        <View style={tw`flex-col`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            1245
          </Text>
          <Text
            style={[
              tw`text-dark-gray text-center`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Following
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
