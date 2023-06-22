import "expo-router/entry";
import { StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../src/redux/store";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  );
}
