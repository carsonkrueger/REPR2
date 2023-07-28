import { useRef } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import tw from "../util/tailwind";
import { RootState } from "../redux/store";
import { selectPostByEntityId } from "../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { EntityId } from "@reduxjs/toolkit";
import { Ionicons } from "@expo/vector-icons";
import CustomColors from "../util/customColors";

const postImageRatio = [1, 1];

interface props {
  postEntityId: EntityId;
}

export default function Post({ postEntityId }: props) {
  const windowWidth = useRef(Dimensions.get("window").width);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );
  const post = useSelector((state: RootState) =>
    selectPostByEntityId(state, postEntityId)
  );

  return (
    <View style={tw`w-full mb-10`}>
      <View style={tw`flex-row items-center px-2 py-2`}>
        <View
          style={tw`w-10 h-10 rounded-full border-[1px] border-light-gray mr-2`}
        />
        <Text
          style={[
            tw` text-dark-gray text-base`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {post?.userName}
        </Text>
      </View>

      {post?.uri !== "" && (
        <Image
          source={{ uri: post?.uri }}
          style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px`}
        />
      )}
      {post?.uri === "" && (
        <View
          style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px bg-transparent`}
        />
      )}

      <View style={tw`flex-row py-2 px-3 justify-between w-25`}>
        <TouchableOpacity>
          <Ionicons
            name={post?.isLiked ? "heart-sharp" : "heart-outline"}
            color={post?.isLiked ? CustomColors.danger : CustomColors.primary}
            size={33}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="chatbubble-outline"
            size={30}
            color={CustomColors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
