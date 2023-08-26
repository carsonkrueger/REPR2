import { useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function useBackPress(
  navigateBackOnBackPress: boolean,
  onBackPress?: () => void
) {
  const router = useRouter();

  function navigateBack() {
    router.back();
  }

  useEffect(() => {
    const backAction = () => {
      if (onBackPress) onBackPress();
      if (navigateBackOnBackPress) navigateBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
}
