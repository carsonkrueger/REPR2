import { useSelector } from "react-redux";
import { WorkoutTemplate } from "../types/workoutTypes";
import { selectExercises, selectWorkout } from "../redux/slices/workoutSlice";
import { RootState } from "../redux/store";

export function cleanNumStr(text: string) {
  return text.replace(/[^0-9]/g, "");
}

export function templateFromCurrentWorkout(): WorkoutTemplate {
  const wokroutState = useSelector((state: RootState) => selectWorkout(state));
  const exercises = useSelector((state: RootState) => selectExercises(state));
  const d = new Date();

  return {
    exerciseNames: exercises.ids.map((id) => {
      if (exercises.entities[id] && exercises.entities[id]?.name !== undefined)
        return exercises.entities[id]?.name;
      else return "";
    }),
    lastPerfromed:
      d.getFullYear().toString() +
      "-" +
      d.getMonth().toString() +
      "-" +
      d.getDate().toString(),
  };
}
