import "expo-router/entry";

import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { useFonts } from "expo-font";
import { useCallback, useEffect } from "react";
import { getSession, selectProfile } from "../../src/redux/slices/profileSlice";
import { initWorkoutTemplatesTable } from "../../src/sqlite/queries";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const profile = useSelector((state: RootState) => selectProfile(state));

  const [fontsLoaded] = useFonts({
    RobotoCondensed: require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
  });

  useEffect(() => {
    initWorkoutTemplatesTable();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      if (!profile.session || profile.session.expires_in <= 0)
        dispatch(getSession())
          .then((s) => {
            try {
              const session: Session | null = s.payload as Session;
              if (!session || session.expires_in <= 0) router.push("login");
              console.log(session);
            } catch (e) {
              console.log(e);
              router.push("login");
            }
          })
          .catch((reason) => {
            console.log(reason);
            router.push("login");
          });
      else console.log("success");
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !profile.session) return null;

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
