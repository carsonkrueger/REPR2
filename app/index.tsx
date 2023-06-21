import "expo-router/entry";
import { StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../src/redux/store";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    // <SafeAreaView style={styles.container}>
    /* <StatusBar style="dark" /> */
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>

    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: "#fff",
  },
});
