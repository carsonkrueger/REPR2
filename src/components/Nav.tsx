import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NavItem from "./NavItem";
import tw from "../util/tailwind";
import { useRouter } from "expo-router";

export default function Nav() {
  const router = useRouter();

  return (
    <View
      style={tw`absolute bottom-0 right-0 left-0 bg-white flex-1 flex-row h-13 m-3 rounded-full shadow-md`}
    >
      <NavItem href="/" name="Home" />
      <NavItem href="/" name="Search" />

      <TouchableOpacity
        style={tw`flex-0.75 bg-blue-300 rounded-full`}
        onPress={() => router.push("/workouts")}
      ></TouchableOpacity>

      <NavItem href="/settings" name="Settings" />
      <NavItem href="/settings" name="Profile" />
    </View>
  );
}
