import { TouchableOpacity, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../util/tailwind";
import CustomColors from "../util/customColors";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";

interface props {
  placeholderText?: string;
  searchAndReturnElements(str: string): Promise<React.ReactNode[]>;
  useSearchResultContainerOverlay?: boolean;
  maxTWHeight?: number | string;
  allowEmptySearch?: boolean;
  doInitEmptySearch?: boolean;
}

export default function SearchBar({
  placeholderText = "Search",
  searchAndReturnElements,
  useSearchResultContainerOverlay = true,
  maxTWHeight = 60,
  allowEmptySearch = false,
  doInitEmptySearch = false,
}: props) {
  const [searchResults, setSearchResults] = useState<React.ReactNode[]>([]);
  const searchInput = useRef("");

  useEffect(() => {
    if (doInitEmptySearch) {
      ExerciseSearch("");
    }
  }, []);

  function ExerciseSearch(name: string) {
    searchAndReturnElements(name).then((nodes) => setSearchResults(nodes));
  }

  function onSearchTextChange(name: string) {
    searchInput.current = name.trim();
    if (!allowEmptySearch && name.trim() === "") return;
    ExerciseSearch(name.trim());
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

        <TouchableOpacity onPress={() => ExerciseSearch(searchInput.current)}>
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
          {/* <FlashList renderItem={}/> */}
          <ScrollView>{searchResults?.map((node) => node)}</ScrollView>
        </View>
      )}
    </View>
  );
}
