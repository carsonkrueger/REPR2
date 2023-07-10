import "expo-router/entry";

import { useDispatch } from "react-redux";
import { SplashScreen, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import * as SpashScreen from "expo-splash-screen";

import { getSession, selectProfile } from "../../src/redux/slices/profileSlice";
import { initWorkoutTemplatesTable } from "../../src/sqlite/queries";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const profile = useSelector((state: RootState) => selectProfile(state));

  const [appIsReady, setAppIsReady] = useState(false);
  // const [fontsLoaded] = Font.useFonts({
  //   RobotoCondensed: require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
  // });

  useEffect(() => {
    async function prepare() {
      try {
        initWorkoutTemplatesTable();
        await Font.loadAsync({
          RobotoCondensed: require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!profile.session || profile.session?.expires_in <= 0)
      router.push("login");

    if (appIsReady) {
      await SpashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <SafeAreaView style={tw`flex-1 bg-back `} onLayout={onLayoutRootView}>
      <View style={tw`flex-row px-3 py-2 bg-front shadow-md justify-between`}>
        <Text
          style={[tw`text-xl text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          REPR
        </Text>

        <TouchableOpacity>
          <Ionicons
            name="chatbubble-outline"
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
