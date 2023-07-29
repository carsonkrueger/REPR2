import { useEffect, useRef } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import tw from "../util/tailwind";
import { AppDispatch, RootState } from "../redux/store";
import {
  getDidLikePost,
  selectPostByEntityId,
  toggleLikePost,
} from "../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { EntityId } from "@reduxjs/toolkit";
import { Ionicons } from "@expo/vector-icons";
import CustomColors from "../util/customColors";
import { useDispatch } from "react-redux";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { selectUserId } from "../redux/slices/profileSlice";

const postImageRatio = [1, 1];

interface props {
  postEntityId: EntityId;
}

export default function Post({ postEntityId }: props) {
  const dispatch = useDispatch<AppDispatch>();
  const windowWidth = useRef(Dimensions.get("window").width);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );
  const post = useSelector((state: RootState) =>
    selectPostByEntityId(state, postEntityId)
  )!;
  const userId = useSelector((state: RootState) => selectUserId(state));

  useEffect(() => {
    dispatch(getDidLikePost({ post: post, userId: userId }));
  }, []);

  async function onDoubleTap() {
    togglePostIsLiked();
  }

  async function togglePostIsLiked() {
    dispatch(toggleLikePost({ post: post, userId: userId }));
  }

  return (
    <View style={tw`w-full mb-10`}>
      <View style={tw`flex-row justify-between px-2 py-2`}>
        <TouchableOpacity style={tw`flex-row items-center`}>
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
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center`}>
          <Text
            style={[
              tw`text-primary text-base`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Follow
          </Text>
        </TouchableOpacity>
      </View>

      {post?.uri !== "" && (
        <TouchableWithoutFeedback>
          <Image
            source={{ uri: post?.uri }}
            style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px`}
          />
        </TouchableWithoutFeedback>
      )}
      {post?.uri === "" && (
        <TouchableWithoutFeedback>
          <View
            style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px bg-transparent`}
          />
        </TouchableWithoutFeedback>
      )}

      <View style={tw`flex-row pt-2 px-3 justify-between w-36`}>
        <TouchableOpacity onPress={togglePostIsLiked}>
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

        <TouchableOpacity>
          <Ionicons
            name="flag-outline"
            size={30}
            color={CustomColors.primary}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          tw`px-4 text-sm text-primary`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        {post?.numLikes} Likes
      </Text>

      {post?.description && (
        <TouchableOpacity style={[tw` rounded-lg p-1 mt-1 mx-3 max-h-17`, ,]}>
          <Text
            style={[
              tw`text-sm text-dark-gray`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {post?.description}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
