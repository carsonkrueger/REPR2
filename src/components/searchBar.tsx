import {
  TouchableOpacity,
  TextInput,
  View,
  ListRenderItem,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import tw from "../util/tailwind";
import CustomColors from "../util/customColors";
import { useEffect, useRef, useState } from "react";
// import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { FlatList } from "react-native-gesture-handler";

interface props<T> {
  searchAction: (text: string) => Promise<T[]>;
  endReachedSearchAction?: (text: string) => Promise<T[]>;
  renderItem: ListRenderItem<T>;
  estimatedItemSize: number;
  placeholderText?: string;
  useSearchResultContainerOverlay?: boolean;
  ContainerOverlayHeight?: number | string;
  allowEmptySearch?: boolean;
  doInitEmptySearch?: boolean;
  isContainerOverlayOpen?: boolean;
  onEndReachedThreshold?: number;
}

export default function SearchBar({
  searchAction,
  endReachedSearchAction,
  renderItem,
  estimatedItemSize,
  placeholderText = "Search",
  useSearchResultContainerOverlay = true,
  ContainerOverlayHeight = 60,
  allowEmptySearch = false,
  doInitEmptySearch = false,
  isContainerOverlayOpen = false,
  onEndReachedThreshold,
}: props<any>) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchInput = useRef("");

  useEffect(() => {
    if (doInitEmptySearch) {
      search("");
    }
  }, []);

  useEffect(() => {
    if (!isContainerOverlayOpen) closeSearchResults();
  }, [isContainerOverlayOpen]);

  async function search(text: string) {
    setSearchResults(await searchAction(text));
  }

  async function endReachedSearch(text: string) {
    if (!endReachedSearchAction) return;
    endReachedSearchAction(text).then((res) => {
      setSearchResults((prev) => prev.concat(res));
    });
  }

  function onEndReached() {
    if (!endReachedSearchAction) return;
    if (!allowEmptySearch && searchInput.current === "") return;
    endReachedSearch(searchInput.current);
  }

  function onSearchTextChange(text: string) {
    searchInput.current = text.trim();
    if (!allowEmptySearch && searchInput.current === "") return;
    search(searchInput.current);
  }

  function closeSearchResults() {
    setSearchResults([]);
  }

  return (
    <View style={tw`${useSearchResultContainerOverlay ? "" : "h-full"}`}>
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
            blurOnSubmit={false}
          />

          {/* OVERLAY SEARCH RESULTS */}
          {useSearchResultContainerOverlay && searchResults.length > 0 && (
            <View
              style={tw`absolute left-0 right-0 top-[140%] bg-front shadow-md rounded-md h-${ContainerOverlayHeight} overflow-hidden z-50`}
            >
              <FlatList
                data={searchResults}
                renderItem={renderItem}
                // estimatedItemSize={estimatedItemSize}
                keyboardShouldPersistTaps={"always"}
                onEndReached={onEndReached}
                onEndReachedThreshold={onEndReachedThreshold}
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
        <View style={tw`flex-1`}>
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            onEndReached={onEndReached}
            // estimatedItemSize={estimatedItemSize}
            onEndReachedThreshold={onEndReachedThreshold}
          />
        </View>
      )}
    </View>
  );
}
