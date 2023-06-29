import "expo-router/entry";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import tw from "../src/util/tailwind";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import colors from "../tailwind.config";

export default function Login() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    RobotoCondensed: require("../assets/fonts/RobotoCondensed-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  console.log(colors["back-primary"]);

  const login = () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* <StatusBar backgroundColor="#60a5fa" /> */}
      <View style={tw`py-3 flex-row justify-between px-5`}>
        <Ionicons name="barbell-sharp" color={"#fff"} size={27} />
        <Text
          style={[
            tw`text-xl text-center text-front `,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          REPR
        </Text>
      </View>

      <View style={tw`px-8 my-auto justify-center max-w-md`}>
        <View
          style={tw`py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm overflow-hidden `}
        >
          <TextInput
            inputMode="email"
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary selection:bg-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder="Email"
            placeholderTextColor={"#a8cfff"}
          />
          <Feather name="mail" color={"#60a5fa"} size={20} style={tw`pr-2`} />
        </View>

        <View
          style={tw`mt-7 py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm`}
        >
          <TextInput
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"#a8cfff"}
          />
          <Feather name="lock" color={"#60a5fa"} size={20} style={tw`pr-2`} />
        </View>

        <TouchableOpacity onPress={login}>
          <View
            style={tw`mt-7 bg-[#3b83f5] h-12 rounded-full justify-center items-center`}
          >
            <Text
              style={[
                tw`text-lg text-front text-center`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              LOGIN
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
