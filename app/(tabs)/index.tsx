import "expo-router/entry";

import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import { supabase } from "../../src/types/supabaseClient";
import { useDispatch } from "react-redux";
import { setSession } from "../../src/redux/slices/profileSlice";
import { useRouter } from "expo-router";
import { upsertWorkoutTemplate } from "../../src/sqlite/queries";

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    RobotoCondensed: require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
  });

  useEffect(() => {
    upsertWorkoutTemplate();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      const session = (await supabase.auth.getSession()).data.session;

      if (session && session.expires_in >= 0) {
        dispatch(setSession({ session: session }));
      } else {
        router.push("login");
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
