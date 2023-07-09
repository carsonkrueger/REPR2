import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";

export default function Metrics() {
  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View style={tw`py-2 bg-front shadow-md`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          METRICS
        </Text>
      </View>
    </SafeAreaView>
  );
}
