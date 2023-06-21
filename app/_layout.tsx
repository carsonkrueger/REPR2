import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

export default function HomeLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Tabs />
    </Provider>
  );
}
