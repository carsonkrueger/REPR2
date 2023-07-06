import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

import tw from "../src/util/tailwind";
import CustomColors from "../src/util/customColors";
import { supabase } from "../src/types/supabaseClient";
import { useDispatch } from "react-redux";
import { setSession } from "../src/redux/slices/profileSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function displayError(msg: string) {
    setErrorMsg(msg);
    setIsLoading(false);
    throw Error("Input validation error: " + msg);
  }

  const login = async () => {
    setIsLoading(true);
    try {
      // Check input validation
      if (email.length > 256) {
        displayError("Invalid email or password");
      } else if (
        !/^[a-zA-Z0-9.!#$%&`*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        displayError("Invalid email or password");
      } else if (password.length < 8) {
        displayError("Invalid email or password");
      } else if (password.length > 64) {
        displayError("Invalid email or password");
      }
    } catch (error) {
      return;
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      try {
        displayError(error.message);
      } catch (error) {
        return;
      }
    }

    if (data.session) dispatch(setSession({ session: data.session }));
    router.back();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* onLayout={onLayoutRootView} */}
      <View style={tw`py-3 flex-row justify-between px-5`}>
        <Ionicons name="barbell-sharp" color={CustomColors.primary} size={27} />
        <Text
          style={[
            tw`text-xl text-center text-primary `,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          REPR
        </Text>
      </View>

      <View style={tw`px-8 my-auto justify-center max-w-md`}>
        <Text
          style={[
            tw`text-danger text-center pb-2`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {errorMsg}
        </Text>

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
            onChangeText={setEmail}
            editable={!isLoading}
          />
          <Feather
            name="mail"
            color={CustomColors.primary}
            size={20}
            style={tw`pr-2`}
          />
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
            onChangeText={setPassword}
            autoCapitalize="none"
            editable={!isLoading}
          />
          <Feather
            name="lock"
            color={CustomColors.primary}
            size={20}
            style={tw`pr-2`}
          />
        </View>

        <TouchableOpacity onPress={login} disabled={isLoading}>
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

      <View style={tw`flex-row pb-3 justify-center`}>
        <Text style={tw`text-light-gray py-1 pr-2`}>New user?</Text>
        <TouchableOpacity onPress={() => router.replace("signup")}>
          <Text style={tw`text-primary py-1`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
