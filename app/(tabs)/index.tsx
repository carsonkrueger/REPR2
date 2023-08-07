import "expo-router/entry";

import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";

import {
  getPlatform,
  getProfile,
  getSession,
  selectProfile,
  setInitLoadedTrue,
} from "../../src/redux/slices/profileSlice";
import {
  initWorkoutTemplatesTable,
  sqlSelectAllWorkoutHistoryByDateDESC,
  sqlSelectExerciseHistoryByWorkoutId,
} from "../../src/sqlite/queries";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import {
  exerciseHistoryTableRow,
  workoutHistoryTableRow,
} from "../../src/types/localDBTables";
import {
  addExerciseHistory,
  addWorkoutHistoryToBack,
} from "../../src/redux/slices/metricsSlice";
import {
  parseExerciseHistoryTableRow,
  parseWorkoutHistoryTableRow,
} from "../../src/util/metricsUtils";
import PremiumIcon from "../../src/components/premiumIcon";
import { Session } from "@supabase/supabase-js";
import {
  clearAllPosts,
  getNextPost,
  selectAllPostsIds,
  selectPostById,
} from "../../src/redux/slices/postsSlice";
import { getCurFullDate } from "../../src/util/dates";
import { FlashList } from "@shopify/flash-list";
import Post from "../../src/components/post";
import { CreatePostSelectionType } from "../../src/types/createPostSelectionType";
import CustomColors from "../../src/util/customColors";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const profile = useSelector((state: RootState) => selectProfile(state));
  const allPostIds = useSelector((state: RootState) =>
    selectAllPostsIds(state)
  );
  // const lastPostDate = getCurFullDate();
  const lastPostDate =
    useSelector((state) =>
      selectPostById(state, allPostIds[allPostIds.length - 1])
    )?.createdAt ?? getCurFullDate();

  const [appIsReady, setAppIsReady] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [distanceFromTop, setDistanceFromTop] = useState(0);

  useEffect(() => {
    // sqlDropAllTables();
    async function prepare() {
      try {
        if (profile.initLoaded) return; // if already loaded data, then return
        dispatch(setInitLoadedTrue());
        await Font.loadAsync({
          RobotoCondensed: require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
        });
        initWorkoutTemplatesTable();
        loadMetricsData();
        dispatch(getPlatform());

        const session = await dispatch(getSession());
        if (session) dispatch(getProfile((session.payload as Session).user.id));
      } catch (error) {
        throw error;
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!profile.session || profile.session?.expires_in <= 0)
      router.push("login");

    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  async function loadMetricsData() {
    sqlSelectAllWorkoutHistoryByDateDESC().then(
      (workoutHistories: workoutHistoryTableRow[]) => {
        workoutHistories.map((workout) => {
          dispatch(
            addWorkoutHistoryToBack({
              workout: parseWorkoutHistoryTableRow(workout),
            })
          );
          sqlSelectExerciseHistoryByWorkoutId(workout.workout_history_id).then(
            (exerciseRows: exerciseHistoryTableRow[]) => {
              exerciseRows.map((exercise) =>
                dispatch(
                  addExerciseHistory({
                    exercise: parseExerciseHistoryTableRow(
                      exercise,
                      workout.performed
                    ),
                  })
                )
              );
            }
          );
        });
      }
    );
  }

  async function onEndOfPageReached() {
    dispatch(getNextPost({ lastPostCreatedAt: lastPostDate }));
  }

  async function onPageRefesh() {
    setIsRefreshing(true);
    dispatch(clearAllPosts());
    await getNextPostLocal();
    setIsRefreshing(false);
  }

  async function getNextPostLocal() {
    dispatch(getNextPost({ lastPostCreatedAt: lastPostDate }));
  }

  async function onCameraCreatePostPress() {
    router.push({
      pathname: "post/createPost",
      params: { selectionType: CreatePostSelectionType.camera },
    });
  }

  async function onGalleryCreatePostPress() {
    router.push({
      pathname: "post/createPost",
      params: { selectionType: CreatePostSelectionType.gallery },
    });
  }

  function onSetDistanceFromTop(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    setDistanceFromTop(event.nativeEvent.contentOffset.y);
  }

  if (!appIsReady) return null;

  return (
    <SafeAreaView style={tw`flex-1 bg-front `} onLayout={onLayoutRootView}>
      <View
        style={tw`flex-row px-3 py-2 bg-front ${
          distanceFromTop >= 10 ? "shadow-md" : ""
        } justify-between`}
      >
        <Text
          style={[tw`text-xl text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          REPR
        </Text>

        <View style={tw`flex-row justify-between w-15`}>
          <TouchableOpacity
            style={tw`items-center justify-center `}
            onPress={onGalleryCreatePostPress}
          >
            <Feather name="plus" size={27} color={CustomColors.primary} />
          </TouchableOpacity>
          <PremiumIcon />
        </View>
      </View>

      <FlashList
        data={allPostIds}
        renderItem={({ item }) => <Post postId={item} />}
        onEndReached={onEndOfPageReached}
        onEndReachedThreshold={0.5}
        estimatedItemSize={507}
        refreshing={isRefreshing}
        onRefresh={onPageRefesh}
        ListFooterComponent={<View style={tw`mb-50`} />}
        onScroll={onSetDistanceFromTop}
      />

      {/* <TouchableOpacity
        style={tw`absolute bottom-18 right-4 items-center justify-center bg-primary rounded-full p-2`}
        onPress={onGalleryCreatePostPress}
      >
        <Feather name="plus" size={30} color={"#fff"} />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
