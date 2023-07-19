import { TouchableOpacity, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../util/tailwind";
import CustomColors from "../util/customColors";
import { useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

interface props {
  placeholderText?: string;
  searchAndReturnElements(str: string): Promise<React.ReactNode[]>;
  useSearchResultContainerOverlay?: boolean;
  maxTWHeight?: number | string;
}

export default function SearchBar({
  placeholderText = "Search",
  searchAndReturnElements,
  useSearchResultContainerOverlay = true,
  maxTWHeight = 60,
}: props) {
  const inputSearchText = useRef<string>("");
  const [searchResults, setSearchResults] = useState<React.ReactNode[]>([]);

  function ExerciseSearch() {
    if (inputSearchText.current.trim() === "") return;
    searchAndReturnElements(inputSearchText.current).then((nodes) =>
      setSearchResults(nodes)
    );
  }

  function onSearchTextChange(text: string) {
    inputSearchText.current = text;
    ExerciseSearch();
  }

  function closeSearchResults() {
    setSearchResults([]);
  }

  return (
    <View>
      {/* Search bar */}
      <View
        style={tw`flex-row items-center justify-between py-2 px-3 bg-front`}
      >
        <View style={tw`flex-1 px-3 py-1 bg-back rounded-2xl mr-1`}>
          <TextInput
            style={[
              tw`text-lg text-dark-gray`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder={placeholderText}
            onChangeText={onSearchTextChange}
            // onEndEditing={closeSearchResults}
          />

          {/* OVERLAY SEARCH RESULTS */}
          {useSearchResultContainerOverlay && searchResults.length > 0 && (
            <View
              style={tw`absolute left-0 right-0 top-[140%] bg-front shadow-md rounded-md max-h-${maxTWHeight} overflow-hidden z-10`}
            >
              <ScrollView>{searchResults?.map((node) => node)}</ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={ExerciseSearch}>
          <Ionicons
            name={"search-outline"}
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>

      {/* NON-OVERLAY SEARCH RESULTS */}
      {!useSearchResultContainerOverlay && (
        <View style={tw` ${maxTWHeight ? `max-h-${maxTWHeight}` : ""}`}>
          <ScrollView>{searchResults?.map((node) => node)}</ScrollView>
        </View>
      )}
    </View>
  );
}
