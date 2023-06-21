import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Exercise } from "../types/workoutTypes";
import { View, Text } from "react-native";
import WorkoutSet from "./WorkoutSetComponet";

interface props {
  exerciseIndex: number;
}

export default function ExerciseComponent({ exerciseIndex }: props) {
  const exercise: Exercise = useSelector(
    (state: RootState) => state.workout.Exercises[exerciseIndex]
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View>
      <Text>{exercise.name}</Text>
      {exercise.Sets.map((_, idx) => (
        <WorkoutSet key={idx} exerciseIndex={exerciseIndex} setIndex={idx} />
      ))}
    </View>
  );
}
