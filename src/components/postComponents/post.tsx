import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getBase64Image,
  getDidLikePost,
  getNumPostLikes,
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
  getUserStats,
  selectUserByUserId,
  toggleIsFollowing,
} from "../../redux/slices/usersSlice";
import PostImage from "./postImage";
import { EntityId } from "@reduxjs/toolkit";
import { daysAgo } from "../../util/dates";
import { useRouter } from "expo-router";
import ProfileIcon from "../profileIcon";

interface props {
  postId: EntityId;
  useCommentIcon?: boolean;
}

export default function Post({ postId, useCommentIcon = true }: props) {
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
    // get image for post if image_id exists and base64Image does not exist
    if (post.imageId && !post.base64Image) dispatch(getBase64Image(post));
  }, []);

  useEffect(() => {
    async function prepare() {
      if (userId === "") return;
      dispatch(getDidLikePost({ post: post, userId: userId }));
      dispatch(getIsFollowing({ user: postUser, userId: userId }));
      dispatch(getNumPostLikes({ postId: post.postId }));
      dispatch(getUserStats({ userId: post.userId }));
    }
    prepare().finally(() => setIsLoading(false));
  }, [userId]);

  async function onDoubleTap() {
    togglePostIsLiked();
  }

  function navigateToViewPost() {
    router.push({
      pathname: `post/${post.postId}`,
      params: { postId: post.postId },
    });
  }

  function navigateToUser() {
    router.push({
      pathname: `user/${post.userId}`,
      params: { userIdParam: post.userId },
    });
  }

  async function togglePostIsLiked() {
    dispatch(toggleLikePost({ post: post, userId: userId }));
  }

  async function togglePostIsFollowing() {
    dispatch(toggleIsFollowing({ followedUser: postUser, userId: userId }));
  }

  function getDayWeeksAgo(): string {
    const daysSince = daysAgo(post.createdAt);
    if (daysSince >= 7) {
      const weeks = Math.floor(daysSince / 7);
      if (weeks === 1) return "1 week ago";
      else return `${weeks} weeks ago`;
    } else {
      if (daysSince === 0) return "Today";
      else if (daysSince === 1) return "Yesterday";
      else return `${daysSince} days ago`;
    }
  }

  return (
    <View style={tw`w-full mb-8`}>
      {/* Header */}
      <View style={tw`flex-row justify-between px-3 py-2`}>
        <View style={tw`flex-row items-center`}>
          {/* User avatar */}
          <ProfileIcon style={tw`mr-3`} radius={10} onPress={navigateToUser} />

          {/* Username */}
          <TouchableOpacity onPress={navigateToUser}>
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

        {/* Follow button */}
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
          {/* Comments icon */}
          {useCommentIcon && (
            <TouchableOpacity onPress={navigateToViewPost}>
              <Ionicons
                name="chatbubble-outline"
                size={30}
                color={CustomColors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity>
          <Ionicons name="flag-outline" size={30} color={CustomColors.danger} />
        </TouchableOpacity>
      </View>

      <View style={tw`px-4 flex-row justify-between`}>
        <Text
          style={[tw`text-sm text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          {post?.numLikes} Likes
        </Text>
        <Text
          style={[
            tw`text-sm text-light-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {getDayWeeksAgo()}
        </Text>
      </View>

      {/* description */}
      {post?.description && (
        <TouchableOpacity
          style={tw` rounded-lg p-1 mt-1 mx-3 max-h-17`}
          onPress={navigateToViewPost}
        >
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
