import "expo-router/entry";
import { Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootState } from "../src/redux/store";
import tw from "../src/util/tailwind";

export default function Home() {
  const [fontsLoaded] = useFonts({
    RobotoCondensed: require("../assets/fonts/RobotoCondensed-Regular.ttf"),
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-back `}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  );
}
