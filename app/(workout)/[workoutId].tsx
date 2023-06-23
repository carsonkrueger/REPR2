import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, TextInput } from "react-native";
import tw from "../../src/util/tailwind";
import { useSelector, useDispatch } from "react-redux";

import ExerciseComponent from "../../src/components/workoutComponents/ExerciseComponent";
import { Workout } from "../../src/types/workoutTypes";
import { RootState, AppDispatch } from "../../src/redux/store";
import { TouchableOpacity } from "react-native-gesture-handler";
import { addExercise } from "../../src/redux/slices/workoutSlice";

export default function WorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useSearchParams();
  const workout: Workout = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <SafeAreaView style={tw`flex-1 flex-col`}>
      {/* HEADER */}
      <View
        style={tw`flex-1 justify-center px-2 bg-white max-h-10 min-h-10 shadow-sm`}
      >
        <TextInput
          placeholder="Workout Name"
          style={tw`px-1 text-lg ${
            workout.isLocked ? "" : "bg-gray-200"
          } rounded-md`}
        >
          {workout.name}
        </TextInput>
      </View>

      {/* EXERCISE COMPONENTS */}
      <FlatList
        data={workout.Exercises}
        renderItem={({ item, index }) => (
          <ExerciseComponent key={index} exerciseIndex={index} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={tw`mt-2 mb-32 rounded-full bg-blue-400 self-center`}
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
