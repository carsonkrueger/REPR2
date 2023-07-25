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
import PremiumIcon from "../../src/components/premiumIcon";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => selectProfile(state));

  function navigateToSettings() {
    router.push("profileSettings");
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* TOP HEADER */}
      <View style={tw`flex-row px-3 py-2 bg-front justify-between z-10`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {profile.username}
        </Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`flex-col justify-end items-center pb-1 pr-2`}
            onPress={navigateToSettings}
          >
            <Ionicons
              name={"settings-outline"}
              color={CustomColors.primary}
              size={27}
            />
          </TouchableOpacity>
          <PremiumIcon />
        </View>
      </View>

      {/* PROFILE ICON AREA*/}
      <View
        style={tw`flex-row pb-5 bg-front justify-evenly items-center px-2 shadow-md`}
      >
        {/* IMAGE */}
        <View
          style={tw`border-[1px] border-light-gray rounded-full h-22 w-22`}
        />

        {/* NUM POSTS */}
        <View style={tw`flex-col min-w-10`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {profile.num_posts}
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

        {/* NUM FOLLOWERS */}
        <View style={tw`flex-col min-w-10`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {profile.num_followers}
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

        {/* NUM FOLLOWING */}
        <View style={tw`flex-col min-w-10`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {profile.num_following}
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
