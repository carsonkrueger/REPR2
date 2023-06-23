import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { WorkoutSet } from "../../types/workoutTypes";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";

import { flexWidths } from "./miscWorkoutStyles";
import { toggleFinishSet } from "../../redux/slices/workoutSlice";

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
    <View style={tw`mx-2 my-1 flex-row items-center`}>
      <Text style={tw`flex-${flexWidths.set} text-center`}>{setIndex}</Text>

      <Text style={tw`flex-${flexWidths.prevVol} text-center`}>
        {workoutSet.weight * workoutSet.reps}
      </Text>

      <Text style={tw`flex-${flexWidths.curVol} text-center`}>
        {workoutSet.weight * workoutSet.reps}
      </Text>

      <View style={tw`flex-${flexWidths.weight}`}>
        <TextInput
          style={tw`mx-1 text-center bg-gray-200 rounded-md`}
          maxLength={4}
        >
          {workoutSet.weight}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.reps}`}>
        <TextInput
          style={tw`mx-1 text-center bg-gray-200 rounded-md`}
          maxLength={4}
        >
          {workoutSet.reps}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.check} text-center h-full`}>
        <TouchableOpacity
          style={tw`flex-1  h-full bg-blue-400 rounded-md`}
          onPress={() => dispatch(toggleFinishSet())}
        />
      </View>
    </View>
  );
}
