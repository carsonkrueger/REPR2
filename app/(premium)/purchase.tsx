import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

export default function Purchase() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-primary`}>
      <MaterialCommunityIcons
        name="crown"
        color={CustomColors.gold}
        size={50}
        style={tw`bg-front rounded-full p-1 my-5 self-center border-gold border-[0px]`}
      />
      <TouchableOpacity
        style={tw`bg-back-primary p-2 rounded-md ${
          selectedIndex === 0 ? "border-gold" : "border-back-primary"
        } border-[2px] m-2`}
        onPress={() => setSelectedIndex(0)}
      >
        <Text>1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-back-primary p-2 rounded-md ${
          selectedIndex === 1 ? "border-gold" : "border-back-primary"
        } border-[2px] m-2`}
        onPress={() => setSelectedIndex(1)}
      >
        <Text>2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-back-primary p-2 rounded-md ${
          selectedIndex === 2 ? "border-gold" : "border-back-primary"
        } border-[2px] m-2`}
        onPress={() => setSelectedIndex(2)}
      >
        <Text>3</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
