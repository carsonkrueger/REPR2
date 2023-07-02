import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useState } from "react";
import { useRouter } from "expo-router";

import tw from "../src/util/tailwind";
import CustomColors from "../src/util/customColors";
import { supabase } from "../src/types/supabaseClient";

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isValidInput, setIsValidInput] = useState(true);

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    if (!email.includes("@") || password.length < 8) {
      setIsValidInput(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error.message);
      setIsValidInput(false);
      return;
    }

    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* import supabase-js from cdn */}
      {/* <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script> */}

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
        {!isValidInput && (
          <Text
            style={[
              tw`text-danger text-center pb-2`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Invalid Email or Password
          </Text>
        )}
        <View
          style={tw`py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm overflow-hidden `}
        >
          <TextInput
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary selection:bg-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder="User Name"
            placeholderTextColor={"#a8cfff"}
            onChangeText={setEmail}
          />
          <TextInput
            inputMode="email"
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary selection:bg-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder="Email"
            placeholderTextColor={"#a8cfff"}
            onChangeText={setEmail}
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
          />
          <Feather
            name="lock"
            color={CustomColors.primary}
            size={20}
            style={tw`pr-2`}
          />
        </View>

        <TouchableOpacity onPress={() => {}}>
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
        <Text style={tw`text-light-gray py-1 pr-2`}>
          Already have an account?
        </Text>
        <TouchableOpacity>
          <Text style={tw`text-primary py-1`}>Login In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
