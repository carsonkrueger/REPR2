import "expo-router/entry";

import { useDispatch } from "react-redux";
import { SplashScreen, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import * as SpashScreen from "expo-splash-screen";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

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

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const profile = useSelector((state: RootState) => selectProfile(state));

  const [appIsReady, setAppIsReady] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerSuccessResult>();

  useEffect(() => {
    // sqlDropAllTables();
    async function prepare() {
      try {
        if (profile.initLoaded) return; // if already loaded data, then return
        dispatch(setInitLoadedTrue());
        await Font.loadAsync({
          RobotoCondensed: require("../../assets/fonts/RobotoCondensed-Regular.ttf"),
        });
        await dispatch(getSession()).then(({ payload }) => {
          dispatch(getProfile((payload as Session).user.id));
        });
        initWorkoutTemplatesTable();
        loadMetricsData();
        dispatch(getPlatform());
      } catch (e) {
        console.warn(e);
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
      await SpashScreen.hideAsync();
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

  async function openGallery() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result);
  }

  async function openCamera() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result);
  }

  if (!appIsReady) return null;

  return (
    <SafeAreaView style={tw`flex-1 bg-front `} onLayout={onLayoutRootView}>
      <View style={tw`flex-row px-3 py-2 bg-front shadow-md justify-between`}>
        <Text
          style={[tw`text-xl text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          REPR
        </Text>

        <PremiumIcon />
      </View>

      <TouchableOpacity
        style={tw`absolute bottom-18 right-4 items-center justify-center bg-primary rounded-full p-2`}
        onPress={openGallery}
      >
        <Feather name="plus" size={30} color={"#fff"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
