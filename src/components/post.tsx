import { useEffect, useRef, useState } from "react";
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
import {
  getIsFollowing,
  selectUserByUserId,
  toggleIsFollowing,
} from "../redux/slices/usersSlice";

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
  const postUser = useSelector((state: RootState) =>
    selectUserByUserId(state, post.userId)
  )!;
  const userId = useSelector((state: RootState) => selectUserId(state));

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      dispatch(getDidLikePost({ post: post, userId: userId }));
      dispatch(getIsFollowing({ user: postUser, userId: userId }));
    }
    prepare().finally(() => setIsLoading(false));
  }, []);

  async function onDoubleTap() {
    togglePostIsLiked();
  }

  async function togglePostIsLiked() {
    dispatch(toggleLikePost({ post: post, userId: userId }));
  }

  async function togglePostIsFollowing() {
    dispatch(toggleIsFollowing({ user: postUser, userId: userId }));
  }

  return (
    <View style={tw`w-full mb-10`}>
      {/* Header */}
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
            {postUser.userName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={togglePostIsFollowing}
          disabled={isLoading}
        >
          <Text
            style={[
              tw`text-primary text-base`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {postUser.isFollowing ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image content */}
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

      {/* like/comment/flag */}
      <View style={tw`flex-row justify-between px-3 pt-2`}>
        <View style={tw`flex-row justify-between w-20`}>
          <TouchableOpacity onPress={togglePostIsLiked} disabled={isLoading}>
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

        <TouchableOpacity>
          <Ionicons name="flag-outline" size={30} color={CustomColors.danger} />
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

      {/* description */}
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
