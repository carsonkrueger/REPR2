import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import tw from "../../src/util/tailwind";
import SettingsItem from "../../src/components/settingsComponents/SettingsItem";
import SettingsGroup from "../../src/components/settingsComponents/SettingsGroup";
import { toggleDarkMode } from "../../src/redux/slices/profileSlice";
import { supabase } from "../../src/types/supabaseClient";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch: AppDispatch = useDispatch();

  function logout() {
    supabase.auth.signOut();
    router.push("login");
  }

  function navigateBack() {
    router.back();
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View
        style={tw`flex-row py-2 bg-front shadow-md justify-center items-center`}
      >
        <TouchableOpacity style={tw`absolute left-1`} onPress={navigateBack}>
          <Ionicons name="md-chevron-back" color={"#3b83f5"} size={30} />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          SETTINGS
        </Text>
      </View>

      <SettingsGroup headerName="Account">
        <SettingsItem itemName="Email" onTap={() => {}} />
        <SettingsItem itemName="Reset Password" onTap={() => {}} />
        <SettingsItem itemName="Premium" onTap={() => {}} />
        <SettingsItem itemName="Logout" onTap={logout} lastItem={true} />
      </SettingsGroup>

      <SettingsGroup headerName="Appearance">
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={profile.isDarkMode}
        />
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={profile.isDarkMode}
        />
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={profile.isDarkMode}
          lastItem={true}
        />
      </SettingsGroup>
    </SafeAreaView>
  );
}
