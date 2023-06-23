import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import NavItem from "./NavItem";
import tw from "../util/tailwind";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Nav() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);

  return (
    <View
      style={tw`absolute bottom-0 right-0 left-0 m-3 p-1 bg-white flex-1 flex-row rounded-full shadow-md`}
    >
      <NavItem href="/" name="Home">
        <Ionicons name="home" color={"#60a5fa"} size={27} />
      </NavItem>

      <NavItem href="/" name="Search">
        <Ionicons name="search" color={"#60a5fa"} size={27} />
      </NavItem>

      <TouchableOpacity
        style={tw`flex-0.75 justify-center items-center bg-blue-400 rounded-full`}
        onPress={() => router.push("/workouts")}
      >
        <Ionicons name="barbell-sharp" color={"#fff"} size={27} />
      </TouchableOpacity>

      <NavItem href="/settings" name="Settings">
        <Ionicons name="settings-sharp" color={"#60a5fa"} size={27} />
      </NavItem>

      <NavItem href="/settings" name="Profile">
        <Ionicons name="person" color={"#60a5fa"} size={27} />
      </NavItem>
    </View>
  );
}
