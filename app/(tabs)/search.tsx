import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import SearchBar from "../../src/components/searchBar";
import { View } from "react-native";
import useBackPress from "../../src/hooks/useBackPress";

export default function Search() {
  useBackPress(false);

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
