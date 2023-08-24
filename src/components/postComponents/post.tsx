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
  getSharedTemplate,
} from "../../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import CustomColors from "../../util/customColors";
import { useDispatch } from "react-redux";
import { selectProfile } from "../../redux/slices/profileSlice";
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
import PostTemplate from "./postTemplate";
import { addWorkoutTemplateToFront } from "../../redux/slices/WorkoutTemplatesSlice";
import { templateFromCurrentWorkout } from "../../util/workoutUtils";
import { sqlInsertCurrentWorkoutTemplate } from "../../sqlite/queries";

interface props {
  postId: EntityId;
  useCommentIcon?: boolean;
  disabledTemplate?: boolean;
  showOnlyFiveExercisesTemplate?: boolean;
}

export default function Post({
  postId,
  useCommentIcon = true,
  disabledTemplate = false,
  showOnlyFiveExercisesTemplate = true,
}: props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) =>
    selectPostById(state, postId)
  )!;
  const postUser = useSelector((state: RootState) =>
    selectUserByUserId(state, post.userId)
  )!;
  const profile = useSelector((state: RootState) => selectProfile(state));

  const [isLoading, setIsLoading] = useState(true);
  const [savedWorkout, setSavedWorkout] = useState(false);

  useEffect(() => {
    // get image for post if image_id exists and base64Image does not exist
    if (post.contentType === 1 && !post.base64Image)
      dispatch(getBase64Image(post));
    else if (post.contentType === 2 && !post.sharedTemplate)
      dispatch(getSharedTemplate(post));
  }, []);

  useEffect(() => {
    async function prepare() {
      if (profile.user.userId === "") return;
      dispatch(getDidLikePost({ post: post, userId: profile.user.userId }));
      dispatch(getIsFollowing({ user: postUser, userId: profile.user.userId }));
      dispatch(getNumPostLikes({ postId: post.postId }));
      dispatch(getUserStats({ userId: post.userId }));
    }
    prepare().finally(() => setIsLoading(false));
  }, [profile.user.userId]);

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

  function canSavePostWorkoutTemplate() {
    if (profile.user.isPremium) return true;
    else {
      router.push("premium");
      return false;
    }
  }

  async function savePostWorkoutTemplate() {
    if (!post.sharedTemplate || savedWorkout || !canSavePostWorkoutTemplate())
      return;

    const insertedId = await sqlInsertCurrentWorkoutTemplate(
      post.sharedTemplate.workoutState,
      post.sharedTemplate.exercises,
      post.sharedTemplate.sets
    );

    dispatch(
      addWorkoutTemplateToFront(
        templateFromCurrentWorkout(
          insertedId,
          post.sharedTemplate?.workoutState,
          post.sharedTemplate?.exercises
        )
      )
    );

    setSavedWorkout(true);
  }

  async function togglePostIsLiked() {
    dispatch(toggleLikePost({ post: post, userId: profile.user.userId }));
  }

  async function togglePostIsFollowing() {
    dispatch(
      toggleIsFollowing({ followedUser: postUser, userId: profile.user.userId })
    );
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
        {postUser.userId !== profile.user.userId && (
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

      {/* post content */}
      {post.contentType === 1 && <PostImage base64={post.base64Image} />}
      {post.contentType === 2 && (
        <PostTemplate
          postId={post.postId}
          showOnlyFiveExercises={showOnlyFiveExercisesTemplate}
          disabled={disabledTemplate}
        />
      )}

      {/* like/comment/flag */}
      <View style={tw`flex-row justify-between px-3 pt-2`}>
        <View style={tw`flex-row justify-between w-18`}>
          <TouchableOpacity onPress={togglePostIsLiked} disabled={isLoading}>
            <Ionicons
              name={post?.isLiked ? "heart-sharp" : "heart-outline"}
              color={post?.isLiked ? CustomColors.danger : CustomColors.primary}
              size={33}
            />
          </TouchableOpacity>
          {/* Comments icon */}
          {useCommentIcon && post.contentType === 1 && (
            <TouchableOpacity onPress={navigateToViewPost}>
              <Ionicons
                name="chatbubble-outline"
                size={30}
                color={CustomColors.primary}
              />
            </TouchableOpacity>
          )}
          {post.contentType === 2 && (
            <TouchableOpacity
              disabled={savedWorkout}
              onPress={savePostWorkoutTemplate}
            >
              <Ionicons
                name={savedWorkout ? "checkmark" : "cloud-download-outline"}
                size={30}
                color={
                  savedWorkout
                    ? CustomColors["extra-dark-green"]
                    : CustomColors.primary
                }
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
