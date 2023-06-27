import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../src/util/tailwind";
import SettingsItem from "../src/components/settingsComponents/SettingsItem";
import SettingsGroup from "../src/components/settingsComponents/SettingsGroup";
import { toggleDarkMode } from "../src/redux/slices/settingsSlice";

export default function Settings() {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch: AppDispatch = useDispatch();

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View style={tw`py-2 bg-front shadow-md`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          Settings
        </Text>
      </View>

      <SettingsGroup headerName="Account">
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={settings.isDarkMode}
        />
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={settings.isDarkMode}
        />
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={settings.isDarkMode}
        />
      </SettingsGroup>

      <SettingsGroup headerName="Appearance">
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={settings.isDarkMode}
        />
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={settings.isDarkMode}
        />
        <SettingsItem
          itemName="Dark Mode"
          onTap={() => dispatch(toggleDarkMode())}
          useToggle={true}
          toggleState={settings.isDarkMode}
        />
      </SettingsGroup>
    </SafeAreaView>
  );
}
