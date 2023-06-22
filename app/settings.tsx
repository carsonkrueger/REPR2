import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch: AppDispatch = useDispatch();

  return (
    <SafeAreaView>
      <Text>Dark Mode: {settings.isDarkMode}</Text>
    </SafeAreaView>
  );
}
