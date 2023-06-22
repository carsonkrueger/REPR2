import { useRouter, useSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import tw from "twrnc";
import { StatusBar } from "expo-status-bar";
import { useSelector, useDispatch } from "react-redux";

import ExerciseComponent from "../../src/components/ExerciseComponent";
import { Workout } from "../../src/types/workoutTypes";
import { RootState, AppDispatch } from "../../src/redux/store";

export default function WorkoutScreen() {
  const router = useRouter();
  const { workoutId } = useSearchParams();
  const workout: Workout = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#fff" style="dark" />

      <View
        style={tw`flex-1 justify-center px-2 bg-white max-h-10 min-h-10 shadow-sm`}
      >
        <Text>Workout ID: {workoutId}</Text>
      </View>

      <View style={tw`p-3 flex-col space-y-4`}>
        {workout.Exercises.map((_, idx) => (
          <ExerciseComponent key={idx} exerciseIndex={idx} />
        ))}
      </View>
    </SafeAreaView>
  );
}
