import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { WorkoutSet } from "../types/workoutTypes";
import { Text } from "react-native";

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

  return <Text>{workoutSet.setIndex}</Text>;
}
