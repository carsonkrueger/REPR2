import { TouchableOpacity, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../util/tailwind";
import CustomColors from "../util/customColors";
import { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  FlashList,
  ListRenderItem,
  ListRenderItemInfo,
} from "@shopify/flash-list";

interface props<T> {
  placeholderText?: string;
  // searchAndReturnElements(str: string): Promise<React.ReactNode[]>;
  useSearchResultContainerOverlay?: boolean;
  maxTWHeight?: number | string;
  allowEmptySearch?: boolean;
  doInitEmptySearch?: boolean;
  searchAction: (text: string) => Promise<T[]>;
  renderItem: ListRenderItem<T>;
  estimatedItemSize: number;
}

export default function SearchBar({
  placeholderText = "Search",
  // searchAndReturnElements,
  useSearchResultContainerOverlay = true,
  maxTWHeight = 60,
  allowEmptySearch = false,
  doInitEmptySearch = false,
  searchAction,
  renderItem,
  estimatedItemSize,
}: props<any>) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchInput = useRef("");

  useEffect(() => {
    if (doInitEmptySearch) {
      search("");
    }
  }, []);

  // function search(name: string) {
  //   searchAndReturnElements(name).then((nodes) => setSearchResults(nodes));
  // }

  async function search(text: string) {
    setSearchResults(await searchAction(text));
    console.log(searchResults);
  }

  function onSearchTextChange(text: string) {
    searchInput.current = text.trim();
    if (!allowEmptySearch && text.trim() === "") return;
    search(text.trim());
  }

  return (
    <View style={tw`h-full`}>
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
          />

          {/* OVERLAY SEARCH RESULTS */}
          {useSearchResultContainerOverlay && searchResults.length > 0 && (
            <View
              style={tw`absolute left-0 right-0 top-[140%] bg-front shadow-md rounded-md min-h-${maxTWHeight} max-h-${maxTWHeight} overflow-hidden z-50`}
            >
              <FlashList
                data={searchResults}
                renderItem={renderItem}
                estimatedItemSize={estimatedItemSize}
              />
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => search(searchInput.current)}>
          <Ionicons
            name={"search-outline"}
            color={CustomColors.primary}
            size={27}
          />
        </TouchableOpacity>
      </View>

      {/* NON-OVERLAY SEARCH RESULTS */}
      {!useSearchResultContainerOverlay && (
        <View style={tw`flex-1 ${maxTWHeight ? `max-h-${maxTWHeight}` : ""}`}>
          <FlashList
            data={searchResults}
            renderItem={renderItem}
            estimatedItemSize={estimatedItemSize}
          />
        </View>
      )}
    </View>
  );
}
