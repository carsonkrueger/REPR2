import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Exercise } from "../../types/workoutTypes";
import WorkoutSetComponent from "./WorkoutSetComponet";
import { flexWidths } from "./miscWorkoutStyles";
import {
  addSet,
  delSet,
  setExerciseName,
} from "../../redux/slices/workoutSlice";

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
    <View style={tw`py-3 my-2 mx-2 bg-white rounded-lg shadow-md`}>
      {/* HEADER */}
      <View style={tw`mx-2`}>
        <TextInput
          placeholder="Exercise Name"
          style={tw`text-lg ${isLocked ? "" : "bg-gray-200"} rounded-md px-1`}
          onChangeText={(name) =>
            dispatch(setExerciseName([exerciseIndex, name]))
          }
          editable={!isLocked}
        >
          {exercise.name}
        </TextInput>
      </View>

      {/* SETS HEADER */}
      <View style={tw`px-2 my-1 flex-row justify-center items-center`}>
        <Text style={tw`flex-${flexWidths.set} text-center`}>Set</Text>
        <Text style={tw`flex-${flexWidths.prevVol} text-xs text-center`}>
          Previous Volume
        </Text>
        <Text style={tw`flex-${flexWidths.curVol} text-xs text-center`}>
          Current Volume
        </Text>
        <Text style={tw`flex-${flexWidths.weight} text-center`}>Weight</Text>
        <Text style={tw`flex-${flexWidths.reps} text-center`}>Reps</Text>
        <View style={tw`flex-${flexWidths.check} text-center`}></View>
      </View>

      {/* SETS */}
      {exercise.Sets.map((_, idx) => (
        <WorkoutSetComponent
          key={idx}
          exerciseIndex={exerciseIndex}
          setIndex={idx}
        />
      ))}

      {/* ADD/DEL SET BUTTONS */}
      <View style={tw`flex-row justify-evenly px-4 pt-2`}>
        <TouchableOpacity onPress={() => dispatch(delSet(exerciseIndex))}>
          <Ionicons name="remove" color={"#60a5fa"} size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => dispatch(addSet(exerciseIndex))}>
          <Ionicons name="add" color={"#60a5fa"} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
