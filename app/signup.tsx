import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import tw from "../src/util/tailwind";
import CustomColors from "../src/util/customColors";
import { supabase } from "../src/types/supabaseClient";
import MySafeAlert from "../src/components/MySafeAlert";
import FormInput from "../src/components/formInput";

export default function SignUp() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [doEmailAlert, setDoEmailAlert] = useState(false);

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    function backAction() {
      router.replace("login");
      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  function displayError(msg: string) {
    setErrorMsg(msg);
    setIsLoading(false);
    throw Error("Input validation error: " + msg);
  }

  const signUp = async () => {
    setIsLoading(true);
    try {
      // Check input validation
      if (userName.length < 3) {
        displayError("User name is too short");
      } else if (userName.length > 25) {
        displayError("User name is too long");
      } else if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
        displayError(
          "User name can only contain letters, numbers and underscores"
        );
      } else if (firstName.length > 20 || firstName.length > 20) {
        displayError("First or last name is too long");
      } else if (
        !/^(?!\s)([a-z ,.'-]+)$/i.test(firstName) ||
        !/^(?!\s)([a-z ,.'-]+)$/i.test(lastName)
      ) {
        displayError("Invalid first or last name");
      } else if (email.length > 256) {
        displayError("Email is too long");
      } else if (
        !/^[a-zA-Z0-9.!#$%&`*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        displayError("Invalid email");
      } else if (password !== confirmPassword) {
        displayError("Passwords do not match");
      } else if (password.length < 8) {
        displayError("Password must be 8 or more characters");
      } else if (password.length > 64) {
        displayError("Password must be less than 65 characters");
      }
    } catch (error) {
      console.log(error);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          user_name: userName,
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      try {
        displayError(error.message);
      } catch (error) {
        return;
      }
    }

    setDoEmailAlert(true);
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

      {/* EMAIL ALERT */}
      {doEmailAlert && (
        <MySafeAlert
          onOutOfBoundsClick={() => {}}
          children={
            <>
              <View
                style={tw`justify-center items-center pr-2 bg-primary rounded-full h-14 w-14`}
              >
                <FontAwesome
                  name="paper-plane"
                  color={CustomColors.front}
                  size={35}
                />
              </View>
              <Text style={tw`text-primary py-3`}>
                Email verification sent!
              </Text>
            </>
          }
          safeCommand={() => {
            setDoEmailAlert(false);
            router.back();
          }}
          safeText="OK"
          key={"safeEmailAlert"}
        />
      )}

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
        <FormInput
          placeholder="User Name"
          placeholderTextColor={"#a8cfff"}
          onChangeText={(text) => setUserName(text.trim())}
          editable={!isLoading}
        />

        {/* FIRST/LAST NAME */}
        <View style={tw`mt-4 flex-row justify-between`}>
          {/* First name */}
          <FormInput
            style={tw`mr-2 flex-1`}
            placeholder="First Name"
            placeholderTextColor={"#a8cfff"}
            onChangeText={(text) => setFirstName(text.trim())}
            editable={!isLoading}
          />
          {/* Last name */}
          <FormInput
            style={tw`flex-1`}
            placeholder="Last Name"
            placeholderTextColor={"#a8cfff"}
            onChangeText={(text) => setLastName(text.trim())}
            editable={!isLoading}
          />
        </View>

        {/* EMAIL */}
        <FormInput
          style={tw`mt-4`}
          inputMode="email"
          placeholder="Email"
          placeholderTextColor={"#a8cfff"}
          onChangeText={(text) => setEmail(text.trim())}
          editable={!isLoading}
          rightItem={
            <Feather
              name="mail"
              color={CustomColors.primary}
              size={20}
              style={tw`pr-2`}
            />
          }
        />

        {/* PASSWORD */}
        <FormInput
          style={tw`mt-4`}
          secureTextEntry={true}
          placeholder="Password"
          placeholderTextColor={"#a8cfff"}
          onChangeText={(text) => setPassword(text.trim())}
          autoCapitalize="none"
          editable={!isLoading}
          rightItem={
            <Feather
              name="lock"
              color={CustomColors.primary}
              size={20}
              style={tw`pr-2`}
            />
          }
        />

        {/* CONFIRM PASSWORD */}
        <FormInput
          style={tw`mt-4`}
          secureTextEntry={true}
          placeholder="Confirm Password"
          placeholderTextColor={"#a8cfff"}
          onChangeText={(text) => setConfirmPassword(text.trim())}
          autoCapitalize="none"
          editable={!isLoading}
          rightItem={
            <Feather
              name="lock"
              color={CustomColors.primary}
              size={20}
              style={tw`pr-2`}
            />
          }
        />

        <TouchableOpacity onPress={signUp} disabled={isLoading}>
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
        <TouchableOpacity onPress={() => router.replace("login")}>
          <Text style={tw`text-primary py-1`}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
