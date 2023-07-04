import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import ExerciseComponent from "../../../src/components/workoutComponents/ExerciseComponent";
import { WorkoutState } from "../../../src/types/workoutTypes";
import { RootState, AppDispatch } from "../../../src/redux/store";
import {
  addExercise,
  resetWorkout,
  selectExercises,
  selectWorkout,
  startWorkout,
  toggleLock,
} from "../../../src/redux/slices/workoutSlice";
import MyAlert from "../../../src/components/MyDangerAlert";
import tw from "../../../src/util/tailwind";

export default function WorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const workout: WorkoutState = useSelector((state: RootState) =>
    selectWorkout(state)
  );
  const exerciseIds = useSelector((state: RootState) =>
    selectExercises(state)
  ).ids;
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    dispatch(startWorkout());

    const backAction = () => {
      backPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const backPress = () => {
    setBackPressed((prev) => !prev);
  };

  const finishWorkout = () => {
    // backPress();
    dispatch(resetWorkout());
    router.back();
    router.replace("/workouts");
  };

  const cancelWorkout = () => {
    // backPress();
    dispatch(resetWorkout());
    router.back();
    router.replace("/workouts");
  };

  return (
    <SafeAreaView style={[tw`flex-1 bg-back z-0`, { elevation: 0 }]}>
      {/* BACK ALERT */}
      {backPressed && (
        <MyAlert
          msg="Are you sure you want to finish your workout?"
          closeAlert={backPress}
          dangerCommand={cancelWorkout}
          safeCommand={finishWorkout}
          dangerText="Cancel Workout"
          safeText="Finish Workout"
        />
      )}

      {/* HEADER */}
      <View
        style={tw`flex-row justify-center items-center px-2 py-3 bg-front shadow-sm z-10`}
      >
        <TouchableOpacity onPress={backPress}>
          <Ionicons name="md-chevron-back" color={"#3b83f5"} size={30} />
        </TouchableOpacity>

        <TextInput
          style={[
            tw`flex-1 px-2 py-1 mx-1 text-xl rounded-md text-primary ${
              workout.isLocked ? "" : "bg-back"
            } `,
            { fontFamily: "RobotoCondensed" },
          ]}
          placeholder="Workout Name"
          placeholderTextColor={"#c2c2c2"}
          editable={!workout.isLocked}
        >
          {workout.name}
        </TextInput>

        <TouchableOpacity onPress={() => dispatch(toggleLock())}>
          <Entypo
            name={`${workout.isLocked ? "lock" : "lock-open"}`}
            color={"#3b83f5"}
            size={30}
          />
        </TouchableOpacity>
      </View>

      {/* EXERCISE COMPONENTS */}
      <FlashList
        data={exerciseIds}
        // removeClippedSubviews={false}
        // CellRendererComponent={({ children }) => children}
        renderItem={({ item }) => (
          <ExerciseComponent key={"exercise" + item} exerciseId={item} />
        )}
        estimatedItemSize={220}
        ListFooterComponent={
          // ADD EXERCISE BUTTON
          <View style={tw`mt-4 mb-[70%] items-center`}>
            {!workout.isLocked && (
              <TouchableOpacity
                style={tw`rounded-full bg-primary shadow-md`}
                onPress={() =>
                  dispatch(
                    addExercise({
                      nextExerciseId: workout.nextExerciseId,
                      nextSetId: workout.nextSetId,
                    })
                  )
                }
              >
                <Text style={tw`py-2 px-4 self-center text-center text-white`}>
                  ADD EXERCISE
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
