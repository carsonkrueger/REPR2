import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Workout } from "../types/workoutTypes";
import { View, Text } from "react-native";
import ExerciseComponent from "./ExerciseComponent";

export default function WorkoutComponent() {
  const workout: Workout = useSelector((state: RootState) => state.workout);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View>
      <Text>{workout.name}</Text>
      {workout.Exercises.map((_, idx) => (
        <ExerciseComponent key={idx} exerciseIndex={idx} />
      ))}
    </View>
  );
}
