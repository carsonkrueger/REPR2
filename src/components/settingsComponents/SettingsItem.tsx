import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import tw from "../../util/tailwind";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface props {
  itemName: string;
  onTap: () => void;
  useToggle?: boolean;
  toggleState?: boolean;
}

const SettingsItem = ({ itemName, onTap, useToggle, toggleState }: props) => {
  return (
    <TouchableOpacity onPress={onTap}>
      <View
        style={tw`flex-row justify-between items-center h-12 px-2 mx-2 border-b-[1px] border-b-back`}
      >
        <Text style={tw`text-light-gray`}>{itemName}</Text>

        <View>
          {useToggle ? (
            <View
              style={tw`w-14 h-7 p-1 rounded-full  ${
                toggleState ? "bg-primary" : "bg-light-gray"
              }`}
            >
              <View style={tw`w-5 h-5 rounded-full bg-white`} />
            </View>
          ) : (
            <Ionicons name="md-chevron-forward" color={"#60a5fa"} size={25} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
