import { TouchableOpacity, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";

export default function Search() {
  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      <View
        style={tw`flex-row items-center justify-between py-2 px-3 bg-front shadow-md`}
      >
        <TextInput
          style={tw`flex-1 px-2 py-1 mr-2 bg-back rounded-2xl text-lg text-dark-gray`}
          placeholder="Search"
        />
        <TouchableOpacity>
          <Ionicons
            name={"search-outline"}
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
