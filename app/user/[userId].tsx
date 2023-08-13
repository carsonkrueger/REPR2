import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { selectUserId } from "../../src/redux/slices/profileSlice";
import { FlashList } from "@shopify/flash-list";
import SmallPost from "../../src/components/postComponents/smallPost";
import { useEffect, useRef } from "react";
import { getNextUserPosts } from "../../src/redux/slices/postsSlice";
import {
  selectUserByUserId,
  toggleIsFollowing,
} from "../../src/redux/slices/usersSlice";

const POST_INCREMENT_AMOUNT = 10;

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { userIdParam } = useLocalSearchParams<{ userIdParam: string }>();
  const userId = useSelector((state: RootState) => selectUserId(state));

  const user = useSelector((state) =>
    selectUserByUserId(state, userIdParam as string)
  )!;

  const nextPostIndex = useRef(0);

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // useEffect(() => {
  //   dispatch(
  //     getNext10UserPosts({
  //       userId: profile.user.userId,
  //       indexStart: nextPostIndex.current,
  //     })
  //   );
  //   nextPostIndex.current = POST_INCREMENT_AMOUNT;
  // }, []);

  async function togglePostIsFollowing() {
    dispatch(toggleIsFollowing({ followedUser: user, userId: userId }));
  }

  function onEndOfPageReached() {
    dispatch(
      getNextUserPosts({
        userId: userIdParam as string,
        numPostsToGet: POST_INCREMENT_AMOUNT,
        indexStart: nextPostIndex.current,
      })
    );
    nextPostIndex.current += POST_INCREMENT_AMOUNT;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* TOP HEADER */}
      <View style={tw`flex-row px-3 py-2 bg-front justify-between z-10`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {user.userName}
        </Text>
        <View style={tw`flex-row`}>
          {/* Follow button */}
          {user.userId !== userIdParam && (
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={togglePostIsFollowing}
            >
              <Text
                style={[
                  tw`text-primary text-base`,
                  { fontFamily: "RobotoCondensed" },
                ]}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity
            style={tw`flex-col justify-end items-center pb-1 pr-2`}
            onPress={navigateToSettings}
          >
            <Ionicons
              name={"settings-outline"}
              color={CustomColors.primary}
              size={27}
            />
          </TouchableOpacity>
          <PremiumIcon /> */}
        </View>
      </View>

      {/* PROFILE ICON AREA*/}
      <View
        style={tw`flex-row pb-5 bg-front justify-evenly items-center px-2 shadow-md`}
      >
        {/* IMAGE */}
        <View
          style={tw`border-[1px] border-light-gray rounded-full h-22 w-22`}
        />

        {/* NUM POSTS */}
        <View style={tw`flex-col min-w-10`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {user.numPosts}
          </Text>

          <Text
            style={[
              tw`text-dark-gray text-center`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Posts
          </Text>
        </View>

        {/* NUM FOLLOWERS */}
        <View style={tw`flex-col min-w-10`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {user.numFollowers}
          </Text>
          <Text
            style={[
              tw`text-dark-gray text-center`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Followers
          </Text>
        </View>

        {/* NUM FOLLOWING */}
        <View style={tw`flex-col min-w-10`}>
          <Text
            style={[
              tw`text-black text-center text-lg`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {user.numFollowing}
          </Text>
          <Text
            style={[
              tw`text-dark-gray text-center`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Following
          </Text>
        </View>
      </View>

      {/* POST IMAGES */}
      <FlashList
        contentContainerStyle={tw`p-[0.5px]`}
        data={user.postIds}
        renderItem={({ item }) => (
          <SmallPost postId={item} key={"smallPost" + item} />
        )}
        estimatedItemSize={100}
        onEndReached={onEndOfPageReached}
        numColumns={3}
      />
    </SafeAreaView>
  );
}
