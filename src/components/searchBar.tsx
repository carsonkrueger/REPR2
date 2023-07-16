import { TouchableOpacity, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { useRef, useState } from "react";

interface props {
  placeholder?: string;
  searchAndReturnElements(str: string): Promise<React.ReactNode[]>;
}

export default function Search({
  placeholder = "Search",
  searchAndReturnElements,
}: props) {
  const inputSearchText = useRef<string>("");
  const [searchResults, setSearchResults] = useState<
    React.ReactNode[] | undefined
  >(undefined);

  function onSubmit() {
    searchAndReturnElements(inputSearchText.current).then((nodes) =>
      setSearchResults(nodes)
    );
  }

  function onSearchTextChange(text: string) {
    inputSearchText.current = text;
  }

  return (
    <View>
      {/* Search bar */}
      <View
        style={tw`flex-row items-center justify-between py-2 px-3 bg-front`}
      >
        <TextInput
          style={[
            tw`flex-1 px-3 py-1 mr-2 bg-back rounded-2xl text-lg text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
          placeholder={placeholder}
          onSubmitEditing={onSubmit}
          onChangeText={onSearchTextChange}
        />
        <TouchableOpacity>
          <Ionicons
            name={"search-outline"}
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>

      {/* Search result elements */}
      <View
        style={tw`absolute top-[100%] border-[1px] border-light-gray rounded-md`}
      >
        {searchResults?.map((node) => node)}
      </View>
    </View>
  );
}
