import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput } from "react-native";
import { useEffect, useState } from "react";
import tw from "../../src/util/tailwind";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import ExerciseComponent from "../../src/components/workoutComponents/ExerciseComponent";
import { Workout } from "../../src/types/workoutTypes";
import { RootState, AppDispatch } from "../../src/redux/store";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  addExercise,
  resetWorkout,
  selectWorkout,
  startWorkout,
  toggleLock,
} from "../../src/redux/slices/workoutSlice";
import MyAlert from "../../src/components/MyAlert";

export default function WorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useSearchParams();

  const workout: Workout = useSelector((state: RootState) =>
    selectWorkout(state)
  );
  const dispatch = useDispatch<AppDispatch>();
  const [backPressed, setBackPressed] = useState(false);

  useEffect(() => {
    dispatch(startWorkout());
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
        style={tw`flex-row justify-center items-center px-2 py-3 bg-white shadow-sm`}
      >
        <TouchableOpacity onPress={backPress}>
          <Ionicons name="md-chevron-back" color={"#60a5fa"} size={30} />
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
            color={"#60a5fa"}
            size={30}
          />
        </TouchableOpacity>
      </View>

      {/* EXERCISE COMPONENTS */}
      <FlashList
        data={workout.Exercises}
        // removeClippedSubviews={false}
        // CellRendererComponent={({ children }) => children}
        renderItem={({ index }) => (
          <ExerciseComponent key={index} exerciseIndex={index} />
        )}
        estimatedItemSize={220}
        ListFooterComponent={
          // ADD EXERCISE BUTTON
          <View style={tw`mt-4 mb-[70%] items-center`}>
            {!workout.isLocked && (
              <TouchableOpacity
                style={tw`rounded-full bg-blue-400 shadow-md`}
                onPress={() => dispatch(addExercise())}
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
