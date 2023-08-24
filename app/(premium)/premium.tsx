import { View, Text } from "react-native";
import tw from "../../src/util/tailwind";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomColors from "../../src/util/customColors";
import PremiumItem from "../../src/components/premiumItem";
import { SafeAreaView } from "react-native-safe-area-context";
import useBackPress from "../../src/hooks/useBackPress";

export default function premium() {
  useBackPress(true);

  const router = useRouter();

  function navigateBack() {
    router.back();
  }

  function onGetPremiumClick() {
    router.push("purchase");
  }

  return (
    <SafeAreaView
      style={tw`bg-primary flex-1 flex-col justify-evenly items-center`}
    >
      <View>
        <MaterialCommunityIcons
          name="crown"
          color={CustomColors.gold}
          size={50}
          style={tw`bg-front rounded-full p-1 mb-5 self-center`}
        />

        <PremiumItem text="Unlimited templates" />
        <PremiumItem text="Share and copy workouts" />
        {/* <PremiumItem text="Exercise history charts" /> */}
        {/* <PremiumItem text="Remove ads" /> */}
        <PremiumItem text="More coming soon" />
      </View>

      {/* Get premium / No thanks */}
      <View>
        <TouchableOpacity
          style={tw`bg-gold px-8 py-2 m-1 text-lg rounded-full`}
          onPress={onGetPremiumClick}
        >
          <Text
            style={[
              tw`text-white text-center text-base`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            See Premium Pricing
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateBack}>
          <Text
            style={[
              tw`text-white text-center py-2`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            No Thanks
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
