import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import tw from "../../src/util/tailwind";
import SettingsItem from "../../src/components/settingsComponents/SettingsItem";
import SettingsGroup from "../../src/components/settingsComponents/SettingsGroup";
import { toggleDarkMode } from "../../src/redux/slices/profileSlice";
import { supabase } from "../../src/types/supabaseClient";
import React from "react";
import NavigateBackButton from "../../src/components/navigateBackButton";
import useBackPress from "../../src/hooks/useBackPress";

export default function Settings() {
  useBackPress(true);

  const router = useRouter();
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch: AppDispatch = useDispatch();

  function logout() {
    supabase.auth.signOut();
    router.push("login");
  }

  function backPress() {
    router.back();
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      {/* HEADER */}
      <View
        style={tw`flex-row py-2 bg-front shadow-md justify-center items-center`}
      >
        <NavigateBackButton
          style={tw`absolute left-1`}
          onBackPress={backPress}
        />

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
        <SettingsItem itemName="Premium" onTap={() => router.push("premium")} />
        <SettingsItem itemName="Logout" onTap={logout} lastItem={true} />
      </SettingsGroup>

      {/* <SettingsGroup headerName="Notifications">
        <SettingsItem
          itemName="Recieve Friend Notifications"
          useToggle={true}
          lastItem={true}
          onTap={() => {}}
        />
      </SettingsGroup>
        */}
      <SettingsGroup headerName="Appearance">
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
