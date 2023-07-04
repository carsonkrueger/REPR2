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

export default function Settings() {
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch: AppDispatch = useDispatch();

  const logout = () => {
    supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View style={tw`py-2 bg-front shadow-md`}>
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
