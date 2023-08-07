import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getBase64Image,
  getDidLikePost,
  selectPostById,
  toggleLikePost,
} from "../../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import CustomColors from "../../util/customColors";
import { useDispatch } from "react-redux";
import { selectUserId } from "../../redux/slices/profileSlice";
import {
  getIsFollowing,
  selectUserByUserId,
  toggleIsFollowing,
} from "../../redux/slices/usersSlice";
import PostImage from "./postImage";
import { EntityId } from "@reduxjs/toolkit";
import { daysAgo } from "../../util/dates";
import { supabase } from "../../types/supabaseClient";
import { useRouter } from "expo-router";

interface props {
  postId: EntityId;
}

export default function Post({ postId }: props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) =>
    selectPostById(state, postId)
  )!;
  const postUser = useSelector((state: RootState) =>
    selectUserByUserId(state, post.userId)
  )!;
  const userId = useSelector((state: RootState) => selectUserId(state));

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // get image for post if image_id exists
    if (post.imageId) dispatch(getBase64Image(post));
  }, []);

  useEffect(() => {
    async function prepare() {
      if (userId === "") return;
      dispatch(getDidLikePost({ post: post, userId: userId }));
      dispatch(getIsFollowing({ user: postUser, userId: userId }));
    }
    prepare().finally(() => setIsLoading(false));
  }, [userId]);

  async function onDoubleTap() {
    togglePostIsLiked();
  }

  async function onUsernamePress() {
    router.push({
      pathname: `post/${post.postId}`,
      params: { postId: post.postId },
    });
  }

  async function togglePostIsLiked() {
    dispatch(toggleLikePost({ post: post, userId: userId }));
  }

  async function togglePostIsFollowing() {
    dispatch(toggleIsFollowing({ user: postUser, userId: userId }));
  }

  function getDayWeeksAgo(): string {
    const daysSince = daysAgo(post.createdAt);
    if (daysSince >= 7) {
      const weeks = Math.floor(daysSince / 7);
      if (weeks === 1) return "1 week ago";
      else return `${weeks} week ago`;
    } else {
      if (daysSince === 0) return "Today";
      else if (daysSince === 1) return "1 day ago";
      else return `${daysSince} days ago`;
    }
  }

  return (
    <View style={tw`w-full mb-8`}>
      {/* Header */}
      <View style={tw`flex-row justify-between px-3 py-2`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity>
            <View
              style={tw`w-10 h-10 rounded-full border-[1px] border-light-gray mr-2`}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onUsernamePress}>
            <Text
              style={[
                tw` text-dark-gray text-base`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {postUser.userName}
            </Text>
          </TouchableOpacity>
        </View>

        {postUser.userId !== userId && (
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
        )}
      </View>

      {/* Image content */}
      <PostImage base64={post.base64Image} />

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

      <View style={tw`px-4 flex-row justify-between`}>
        <Text
          style={[tw`text-xs text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          {post?.numLikes} Likes
        </Text>
        <Text
          style={[
            tw`text-xs text-light-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {getDayWeeksAgo()}
        </Text>
      </View>

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
