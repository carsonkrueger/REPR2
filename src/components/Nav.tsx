import { View, Text, StyleSheet } from "react-native";
import NavItem from "./NavItem";
import tw from "twrnc";

export default function Nav() {
  return (
    <View style={tw`flex-1 flex-row justify-around max-h-14`}>
      <NavItem href="/" name="Home" />
      <NavItem href="/workouts" name="Workout" />
      <NavItem href="/settings" name="Settings" />
    </View>
  );
}
