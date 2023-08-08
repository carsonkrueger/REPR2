import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import SearchBar from "../../src/components/searchBar";
import { BackHandler, View } from "react-native";
import { useEffect } from "react";

export default function Search() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      <View style={tw`shadow-md`}>
        <SearchBar
          renderItem={() => <></>}
          searchAction={() => new Promise((resolve) => resolve([]))}
          estimatedItemSize={0}
        />
      </View>
    </SafeAreaView>
  );
}
