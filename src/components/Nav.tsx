import { View, Text, StyleSheet } from "react-native";
import NavIcon from "./NavIcon";

export default function Nav() {
  return (
    <View style={styles.container}>
      <NavIcon href="/" name="Home" />
      <NavIcon href="/workouts" name="Workout" />
      <NavIcon href="/settings" name="Settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    flex: 1,
    flexDirection: "row",
    maxHeight: 45,
    justifyContent: "space-around",
  },
});
