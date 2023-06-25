import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { WorkoutSet } from "../../types/workoutTypes";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import Ionicons from "@expo/vector-icons/Ionicons";

import { flexWidths } from "./miscWorkoutStyles";
import {
  toggleFinishSet,
  setWeight,
  setReps,
} from "../../redux/slices/workoutSlice";

interface props {
  exerciseIndex: number;
  setIndex: number;
}

export default function WorkoutSetComponent({
  exerciseIndex,
  setIndex,
}: props) {
  const workoutSet: WorkoutSet = useSelector(
    (state: RootState) => state.workout.Exercises[exerciseIndex].Sets[setIndex]
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View
      style={tw`px-2 flex-row items-center ${
        workoutSet.isFinished ? "bg-green-200" : ""
      }`}
    >
      <Text style={tw`flex-${flexWidths.set} text-center text-primary`}>
        {setIndex + 1}
      </Text>

      <Text style={tw`flex-${flexWidths.prevVol} text-center text-primary`}>
        {workoutSet.prevWeight * workoutSet.prevReps}
      </Text>

      <Text style={tw`flex-${flexWidths.curVol} text-center text-primary`}>
        {workoutSet.weight * workoutSet.reps}
      </Text>

      <View style={tw`flex-${flexWidths.weight}`}>
        <TextInput
          style={tw`mx-1 text-center bg-gray-200 rounded-md`}
          keyboardType="number-pad"
          maxLength={4}
          editable={!workoutSet.isFinished}
          placeholder={workoutSet.prevWeight.toString()}
          onChangeText={(weight) =>
            dispatch(setWeight([exerciseIndex, setIndex, Number(weight)]))
          }
        >
          {workoutSet.weight === 0 ? "" : workoutSet.weight}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.reps}`}>
        <TextInput
          style={tw`mx-1 text-center bg-gray-200 rounded-md`}
          keyboardType="number-pad"
          maxLength={4}
          editable={!workoutSet.isFinished}
          placeholder={workoutSet.prevReps.toString()}
          onChangeText={(reps) =>
            dispatch(setReps([exerciseIndex, setIndex, Number(reps)]))
          }
        >
          {workoutSet.reps === 0 ? "" : workoutSet.reps}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.check} justify-center items-center`}>
        <TouchableOpacity
          onPress={() => dispatch(toggleFinishSet([exerciseIndex, setIndex]))}
        >
          <Ionicons name="checkbox" color={"#60a5fa"} size={34} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
