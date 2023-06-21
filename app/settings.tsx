import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { Text } from "react-native";

export default function Settings() {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Text>Dark Mode: {settings.isDarkMode}</Text>
    </>
  );
}
