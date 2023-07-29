import { useRef } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import tw from "../util/tailwind";
import { RootState } from "../redux/store";
import {
  selectPostByEntityId,
  toggleLikePost,
} from "../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { EntityId } from "@reduxjs/toolkit";
import { Ionicons } from "@expo/vector-icons";
import CustomColors from "../util/customColors";
import { useDispatch } from "react-redux";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const postImageRatio = [1, 1];

interface props {
  postEntityId: EntityId;
}

export default function Post({ postEntityId }: props) {
  const dispatch = useDispatch();
  const windowWidth = useRef(Dimensions.get("window").width);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );
  const post = useSelector((state: RootState) =>
    selectPostByEntityId(state, postEntityId)
  );

  async function onDoubleTap() {
    togglePostIsLiked();
  }

  async function togglePostIsLiked() {
    dispatch(toggleLikePost({ postId: post!.id }));
  }

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

      <View style={tw`flex-row py-2 px-3 justify-between w-28`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={togglePostIsLiked}>
            <Ionicons
              name={post?.isLiked ? "heart-sharp" : "heart-outline"}
              color={post?.isLiked ? CustomColors.danger : CustomColors.primary}
              size={33}
            />
          </TouchableOpacity>
          <Text
            style={[
              tw`text-xs text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {post?.numLikes}
          </Text>
        </View>

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
