import { Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../src/redux/store";
import tw from "../src/util/tailwind";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <Text>Search Screen</Text>
    </SafeAreaView>
  );
}
