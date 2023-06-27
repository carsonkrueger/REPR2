import { Workout, WorkoutTemplate } from "../types/workoutTypes";

export function templateFromWorkout(workout: Workout): WorkoutTemplate {
  const d = new Date();
  const lastPerfromed =
    d.getMonth().toString() +
    "-" +
    d.getDate().toString() +
    "-" +
    d.getFullYear().toString();
  return {
    exerciseNames: workout.Exercises.map((ex) => ex.name),
    lastPerfromed: lastPerfromed,
    workoutId: workout.id,
    workoutName: workout.name,
  };
}

export function cleanNumStr(text: string) {
  return text.replace(/[^0-9]/g, "");
}
