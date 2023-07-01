import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";

export default function Home() {
  return (
    <SafeAreaView style={tw`flex-1 bg-back `}>
      <View style={tw`flex-row px-3 py-2 bg-front shadow-md justify-between`}>
        <Text
          style={[tw`text-xl text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          REPR
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="chatbubble-outline"
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
