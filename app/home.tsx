import { Text, TouchableOpacity, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { RootState } from "../src/redux/store";
import tw from "../src/util/tailwind";

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
          <Ionicons name="chatbubble-outline" color={"#60a5fa"} size={27} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
