import { TouchableOpacity, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

interface props {
  placeholder?: string;
  searchAndReturnElements(str: string): Promise<React.ReactNode[]>;
}

export default function Search({
  placeholder = "Search",
  searchAndReturnElements,
}: props) {
  const inputSearchText = useRef<string>("");
  const [searchResults, setSearchResults] = useState<React.ReactNode[]>([]);

  function onSubmit() {
    if (inputSearchText.current === "") return;
    searchAndReturnElements(inputSearchText.current).then((nodes) =>
      setSearchResults(nodes)
    );
  }

  function onSearchTextChange(text: string) {
    inputSearchText.current = text;
    onSubmit();
  }

  return (
    <View>
      {/* Search bar */}
      <View
        style={tw`flex-row items-center justify-between py-2 px-3 bg-front`}
      >
        <View style={tw`flex-1 px-3 py-1 mr-2 bg-back rounded-2xl `}>
          <TextInput
            style={[
              tw`text-lg text-dark-gray`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder={placeholder}
            onSubmitEditing={onSubmit}
            onChangeText={onSearchTextChange}
          />
          {/* Search result elements */}
          {searchResults.length > 0 && (
            <View
              style={tw`absolute left-0 right-0 top-[140%] border-[1px] border-light-gray rounded-md max-h-60 overflow-hidden`}
            >
              <ScrollView>{searchResults?.map((node) => node)}</ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity>
          <Ionicons
            name={"search-outline"}
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
