import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { selectProfile } from "../../src/redux/slices/profileSlice";
import PremiumIcon from "../../src/components/premiumIcon";
import { FlashList } from "@shopify/flash-list";
import SmallPost from "../../src/components/postComponents/smallPost";
import { useEffect, useRef } from "react";
import {
  getNextUserPosts,
  selectAllPosts,
  selectAllPostsIdsByType,
} from "../../src/redux/slices/postsSlice";
import { selectUserByUserId } from "../../src/redux/slices/usersSlice";
import ProfileIcon from "../../src/components/profileIcon";

const POST_INCREMENT_AMOUNT = 10;

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector((state: RootState) => selectProfile(state));
  const user = useSelector((state) =>
    selectUserByUserId(state, profile.user.userId)
  )!;
  const imagePostIds = useSelector((state: RootState) =>
    selectAllPostsIdsByType(state, 1)
  );

  const nextPostIndex = useRef(0);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  function navigateToSettings() {
    router.push("profileSettings");
  }

  // useEffect(() => {
  //   dispatch(
  //     getNext10UserPosts({
  //       userId: profile.user.userId,
  //       indexStart: nextPostIndex.current,
  //     })
  //   );
  //   nextPostIndex.current = POST_INCREMENT_AMOUNT;
  // }, []);

  function onEndOfPageReached() {
    dispatch(
      getNextUserPosts({
        numPostsToGet: POST_INCREMENT_AMOUNT,
        userId: profile.user.userId,
        indexStart: nextPostIndex.current,
      })
    );
    nextPostIndex.current += POST_INCREMENT_AMOUNT;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* TOP HEADER */}
      <View>
        <View style={tw`flex-row px-3 py-2 justify-between z-10`}>
          <Text
            style={[
              tw`text-xl text-center text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {profile.user.userName}
          </Text>
          <View style={tw`flex-row`}>
            <TouchableOpacity
              style={tw`flex-col justify-end items-center pb-1 pr-2`}
              onPress={navigateToSettings}
            >
              <Ionicons
                name={"settings-outline"}
                color={CustomColors.primary}
                size={27}
              />
            </TouchableOpacity>
            <PremiumIcon />
          </View>
        </View>

        {/* PROFILE ICON AREA*/}
        <View style={tw`flex-row pb-5 justify-evenly items-center px-2`}>
          {/* IMAGE */}
          <ProfileIcon radius={22} />

          {/* NUM POSTS */}
          <View style={tw`flex-col min-w-10`}>
            <Text
              style={[
                tw`text-black text-center text-lg`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {profile.user.numPosts}
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
              {profile.user.numFollowers}
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
              {profile.user.numFollowing}
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

        {/* POST/TEMPLATE TAB */}
        <View style={tw`flex-row py-1`}>
          <TouchableOpacity style={tw`flex-1`}>
            <Text
              style={[
                tw`text-base text-center text-dark-gray`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              Images
            </Text>
          </TouchableOpacity>
          {/* Divider line */}
          <View style={tw`border-r-[1px] border-r-light-gray`} />
          <TouchableOpacity style={tw`flex-1`}>
            <Text
              style={[
                tw`text-base text-center text-dark-gray`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              Templates
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* POST IMAGES */}
      <FlashList
        contentContainerStyle={tw`p-[0.5px]`}
        data={imagePostIds}
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
