import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import SearchBar from "../../src/components/searchBar";
import { View } from "react-native";

export default function Search() {
  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      <View style={tw`shadow-md`}>
        <SearchBar
          searchAndReturnElements={() => {
            return new Promise((resolve, reject) => resolve([]));
          }}
        />
      </View>
    </SafeAreaView>
  );
}
