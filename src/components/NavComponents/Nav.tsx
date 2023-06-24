import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import NavItem from "./NavItem";
import tw from "../../util/tailwind";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Nav() {
  const router = useRouter();
  const [selectedPos, setSelectedPos] = useState(0);

  const navigateTo = (href: string, index: number) => {
    setSelectedPos(index);
    router.push(href);
  };

  return (
    <View
      style={tw`absolute flex-1 flex-row items-center bottom-0 right-0 left-0 m-3 px-1 py-2 bg-white rounded-full shadow-md`}
    >
      <View
        style={tw`absolute left-0 right-0 justify-center items-center pb-10`}
      >
        <TouchableOpacity
          style={tw` p-3 justify-center items-center bg-blue-400 rounded-full`}
          onPress={() => navigateTo("/workouts", 2)}
        >
          <Ionicons name="barbell-sharp" color={"#fff"} size={27} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`flex-1 flex-col justify-end items-center pb-1`}
        onPress={() => navigateTo("/", 0)}
      >
        <Ionicons
          name={`${selectedPos === 0 ? "home" : "home-outline"}`}
          color={"#60a5fa"}
          size={27}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-1 flex-col justify-end items-center pb-1`}
        onPress={() => navigateTo("/", 1)}
      >
        <Ionicons
          name={`${selectedPos === 1 ? "search" : "search-outline"}`}
          color={"#60a5fa"}
          size={27}
        />
      </TouchableOpacity>

      <View style={tw`flex-0.8`}></View>

      <TouchableOpacity
        style={tw`flex-1 flex-col justify-end items-center pb-1`}
        onPress={() => navigateTo("/settings", 3)}
      >
        <Ionicons
          name={`${
            selectedPos === 3 ? "md-settings-sharp" : "md-settings-outline"
          }`}
          color={"#60a5fa"}
          size={27}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-1 flex-col justify-end items-center pb-1`}
        onPress={() => navigateTo("/settings", 4)}
      >
        <Ionicons
          name={`${selectedPos === 4 ? "person" : "person-outline"}`}
          color={"#60a5fa"}
          size={27}
        />
      </TouchableOpacity>
    </View>
  );
}
