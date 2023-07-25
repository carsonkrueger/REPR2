import { View, Text } from "react-native";
import tw from "../../src/util/tailwind";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function premium() {
  const router = useRouter();

  function navigateBack() {
    router.back();
  }
  return (
    <View style={tw`bg-primary flex-1 flex-col justify-center items-center`}>
      <Text
        style={[
          tw`text-gold text-center py-2 text-lg`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        REPR Premium
      </Text>
      <Text
        style={[
          [
            tw`text-white text-center py-1 text-base`,
            { fontFamily: "RobotoCondensed" },
          ],
        ]}
      >
        Unlimited templates
      </Text>
      <Text
        style={[
          tw`text-white text-center py-1 text-base`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        Share and copy workouts
      </Text>
      <Text
        style={[
          tw`text-white text-center py-1 text-base`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        View exercise history charts
      </Text>
      <Text
        style={[
          tw`text-white text-center py-1 text-base`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        Remove ads
      </Text>
      <TouchableOpacity style={tw`bg-gold px-5 py-2 m-1 text-lg rounded-full`}>
        <Text
          style={[
            tw`text-white text-center`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          GET PREMIUM
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateBack}>
        <Text
          style={[
            tw`text-light-gray text-center py-3`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          No Thanks
        </Text>
      </TouchableOpacity>
    </View>
  );
}
