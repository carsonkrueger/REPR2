import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../src/util/tailwind";

export default function Settings() {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch: AppDispatch = useDispatch();

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <Text>Dark Mode: {settings.isDarkMode}</Text>
    </SafeAreaView>
  );
}
