import { useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function useBackPress(backPressDisabed: boolean) {
  const router = useRouter();

  function backPress() {
    router.back();
  }

  useEffect(() => {
    const backAction = () => {
      if (!backPressDisabed) backPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
}
