import { EntityState } from "@reduxjs/toolkit";
import { Exercise, WorkoutState, WorkoutTemplate } from "../types/workoutTypes";

export function cleanNumStr(text: string) {
  return text.replace(/[^0-9]/g, "");
}

export function templateFromCurrentWorkout(
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>
): WorkoutTemplate {
  const d = new Date();

  return {
    workoutId: workoutState.id,
    exerciseNames: exercises.ids.map(
      (id) => exercises.entities[id]?.name ?? ""
    ),
    lastPerfromed:
      d.getFullYear().toString() +
      "-" +
      d.getMonth().toString() +
      "-" +
      d.getDate().toString(),
    workoutName: workoutState.name,
  };
}
