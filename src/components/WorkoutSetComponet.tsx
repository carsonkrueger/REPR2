import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { WorkoutSet } from "../types/workoutTypes";
import { Text, View } from "react-native";
import tw from "twrnc";

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
    <View style={tw`mx-2 flex-row`}>
      <Text style={tw`flex-1.3 text-center`}>{setIndex}</Text>
      <Text style={tw`flex-3 text-center`}>
        {workoutSet.weight * workoutSet.reps}
      </Text>
      <Text style={tw`flex-3 text-center`}>
        {workoutSet.weight * workoutSet.reps}
      </Text>
      <Text style={tw`flex-3 text-center`}>{workoutSet.weight}</Text>
      <Text style={tw`flex-3 text-center`}>{workoutSet.reps}</Text>
      <View style={tw`flex-1.3 text-center`}></View>
    </View>
  );
}
