import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput } from "react-native";
import { useEffect } from "react";
import tw from "../../src/util/tailwind";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";
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

export default function WorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useSearchParams();
  const workout: Workout = useSelector((state: RootState) =>
    selectWorkout(state)
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(startWorkout());
  }, []);

  const cancelWorkout = () => {
    dispatch(resetWorkout());
    router.back();
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* HEADER */}
      <View
        style={tw`flex-row justify-center items-center px-1 py-3 z-10 bg-white shadow-md`}
      >
        <TouchableOpacity onPress={cancelWorkout}>
          <Ionicons name="md-chevron-back" color={"#60a5fa"} size={30} />
        </TouchableOpacity>

        <TextInput
          style={tw`flex-1 px-2 py-1 mx-1 text-lg ${
            workout.isLocked ? "" : "bg-back"
          } rounded-md`}
          placeholder="Workout Name"
          editable={!workout.isLocked}
        >
          {workout.name}
        </TextInput>
        <TouchableOpacity onPress={() => dispatch(toggleLock())}>
          <Ionicons name="menu" color={"#60a5fa"} size={30} />
        </TouchableOpacity>
      </View>

      {/* EXERCISE COMPONENTS */}
      <FlashList
        data={workout.Exercises}
        renderItem={({ item, index }) => (
          <ExerciseComponent key={index} exerciseIndex={index} />
        )}
        estimatedItemSize={220}
        ListFooterComponent={
          // ADD EXERCISE BUTTON
          <View style={tw`mt-2 mb-64 items-center`}>
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
