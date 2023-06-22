import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { View, Text } from "react-native";
import tw from "twrnc";

import { Exercise } from "../types/workoutTypes";
import WorkoutSet from "./WorkoutSetComponet";
import { TextInput } from "react-native";

interface props {
  exerciseIndex: number;
}

export default function ExerciseComponent({ exerciseIndex }: props) {
  const isLocked: boolean = useSelector(
    (state: RootState) => state.workout.isLocked
  );
  const exercise: Exercise = useSelector(
    (state: RootState) => state.workout.Exercises[exerciseIndex]
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View style={tw`py-3 bg-white rounded-lg shadow-sm`}>
      {/* HEADER */}
      <View style={tw`mx-2`}>
        <TextInput
          style={tw`text-lg ${isLocked ? "" : "bg-gray-200"} rounded-md px-1`}
        >
          {exercise.name}
        </TextInput>
      </View>

      {/* SETS HEADER */}
      <View style={tw`px-2 my-1 flex-row justify-center items-center`}>
        <Text style={tw`flex-1.3 text-center`}>Set</Text>
        <Text style={tw`flex-3 text-xs text-center`}>Previous Volume</Text>
        <Text style={tw`flex-3 text-xs text-center`}>Current Volume</Text>
        <Text style={tw`flex-3 text-center`}>Weight</Text>
        <Text style={tw`flex-3 text-center`}>Reps</Text>
        <View style={tw`flex-1.3 text-center`}></View>
      </View>

      {/* SETS */}
      {exercise.Sets.map((_, idx) => (
        <WorkoutSet key={idx} exerciseIndex={exerciseIndex} setIndex={idx} />
      ))}
    </View>
  );
}
