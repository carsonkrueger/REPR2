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
  const [errorMsg, setErrorMsg] = useState("");

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function displayError(msg: string) {
    setErrorMsg(msg);
  }

  const signUp = async () => {
    if (userName.length < 5) {
      displayError("User name is too short");
      return;
    } else if (!/^[a-zA-Z0-9_]*$/.test(userName)) {
      displayError(
        "User name can only contain letters, numbers and underscores"
      );
      return;
    } else if (
      !/^(?!\s)([a-z ,.'-]+)$/i.test(firstName) ||
      !/^(?!\s)([a-z ,.'-]+)$/i.test(lastName)
    ) {
      displayError("Invalid first or last name");
      return;
    } else if (
      !/^[a-zA-Z0-9.!#$%&`*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      displayError("Invalid email");
      return;
    } else if (password !== confirmPassword) {
      displayError("Passwords do not match");
      return;
    } else if (password.length < 8) {
      displayError("Password must be 8 or more characters long");
      return;
    }

    // const { error } = await supabase.auth.signUp({
    //   email: email,
    //   password: password,
    //   options: {
    //     data: { user_name: userName },
    //   },
    // });

    // if (error) {
    //   console.log(error.message);
    //   displayError("User name or Email has already been taken.");
    //   return;
    // }

    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* HEADER */}
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
        {errorMsg !== "" && (
          <Text
            style={[
              tw`text-danger text-center pb-2`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {errorMsg}
          </Text>
        )}

        {/* USER NAME */}
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
            onChangeText={(text) => setUserName(text.trim())}
          />
        </View>

        {/* FIRST/LAST NAME */}
        <View style={tw`mt-4 flex-row justify-between`}>
          <View
            style={tw`flex-1 py-1 px-2 mr-1 flex-row rounded-full items-center bg-front shadow-sm overflow-hidden `}
          >
            <TextInput
              style={[
                tw`flex-1 px-2 py-2 text-lg text-primary selection:bg-primary`,
                { fontFamily: "RobotoCondensed" },
              ]}
              placeholder="First Name"
              placeholderTextColor={"#a8cfff"}
              onChangeText={(text) => setFirstName(text.trim())}
            />
          </View>

          <View
            style={tw`flex-1 py-1 px-2 ml-1 flex-row rounded-full items-center bg-front shadow-sm overflow-hidden `}
          >
            <TextInput
              style={[
                tw`flex-1 px-2 py-2 text-lg text-primary selection:bg-primary`,
                { fontFamily: "RobotoCondensed" },
              ]}
              placeholder="Last Name"
              placeholderTextColor={"#a8cfff"}
              onChangeText={(text) => setLastName(text.trim())}
            />
          </View>
        </View>

        {/* EMAIL */}
        <View
          style={tw`mt-4 py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm overflow-hidden `}
        >
          <TextInput
            inputMode="email"
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary selection:bg-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder="Email"
            placeholderTextColor={"#a8cfff"}
            onChangeText={(text) => setEmail(text.trim())}
          />
          <Feather
            name="mail"
            color={CustomColors.primary}
            size={20}
            style={tw`pr-2`}
          />
        </View>

        {/* PASSWORD */}
        <View
          style={tw`mt-4 py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm`}
        >
          <TextInput
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={"#a8cfff"}
            onChangeText={(text) => setPassword(text.trim())}
            autoCapitalize="none"
          />
          <Feather
            name="lock"
            color={CustomColors.primary}
            size={20}
            style={tw`pr-2`}
          />
        </View>

        {/* CONFIRM PASSWORD */}
        <View
          style={tw`mt-4 py-1 px-2 flex-row rounded-full items-center bg-front shadow-sm`}
        >
          <TextInput
            style={[
              tw`flex-1 px-2 py-2 text-lg text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
            secureTextEntry={true}
            placeholder="Confirm Password"
            placeholderTextColor={"#a8cfff"}
            onChangeText={(text) => setConfirmPassword(text.trim())}
            autoCapitalize="none"
          />
          <Feather
            name="lock"
            color={CustomColors.primary}
            size={20}
            style={tw`pr-2`}
          />
        </View>

        <TouchableOpacity onPress={signUp}>
          <View
            style={tw`mt-4 bg-[#3b83f5] h-12 rounded-full justify-center items-center`}
          >
            <Text
              style={[
                tw`text-lg text-front text-center`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              SIGN UP
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row pb-3 justify-center`}>
        <Text style={tw`text-light-gray py-1 pr-2`}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={tw`text-primary py-1`}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
