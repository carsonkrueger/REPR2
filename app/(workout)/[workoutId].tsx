import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TextInput } from "react-native";
import tw from "../../src/util/tailwind";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "@expo/vector-icons/Ionicons";

import ExerciseComponent from "../../src/components/workoutComponents/ExerciseComponent";
import { Workout } from "../../src/types/workoutTypes";
import { RootState, AppDispatch } from "../../src/redux/store";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addExercise, toggleLock } from "../../src/redux/slices/workoutSlice";

export default function WorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useSearchParams();
  const workout: Workout = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <SafeAreaView style={tw``}>
      {/* HEADER */}
      <View
        style={tw`flex-row justify-center items-center px-1 py-3 z-10 bg-white shadow-md`}
      >
        <TouchableOpacity onPress={() => router.back()}>
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
      <FlatList
        data={workout.Exercises}
        renderItem={({ item, index }) => (
          <ExerciseComponent key={index} exerciseIndex={index} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={tw`mt-2 mb-52 rounded-full bg-blue-400 self-center`}
            onPress={() => dispatch(addExercise())}
          >
            <Text style={tw`py-2 px-4 self-center text-center text-white`}>
              ADD EXERCISE
            </Text>
          </TouchableOpacity>
        }
      />

      {/* ADD EXERCISE BUTTON */}
    </SafeAreaView>
  );
}
