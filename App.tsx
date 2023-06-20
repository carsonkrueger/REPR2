import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import MainApp from "./src/MainApp";

export default function App() {
  return (
    <SafeAreaView>
      <StatusBar barStyle={"dark-content"} backgroundColor={"#ffffff"} />
      <Provider store={store}>
        <MainApp />
      </Provider>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
