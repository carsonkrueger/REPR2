import { EntityState } from "@reduxjs/toolkit";
import {
  Exercise,
  WorkoutSet,
  WorkoutState,
  WorkoutTemplate,
} from "../types/workoutTypes";
import {
  parsedWorkoutsTableRow,
  unparsedWorkoutsTableRow,
} from "../types/localDBTables";

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

export function templateFromParseWorkoutTableRow(
  row: parsedWorkoutsTableRow
): WorkoutTemplate {
  return {
    workoutId: row.workout_id,
    exerciseNames: row.exercises.ids.map(
      (id) => row.exercises.entities[id]?.name ?? ""
    ),
    lastPerfromed: row.last_performed,
    workoutName: row.workout_state.name,
  };
}

export function parseWorkoutTableRow(
  obj: unparsedWorkoutsTableRow
): parsedWorkoutsTableRow {
  return {
    workout_id: Number(obj.workout_id),
    workout_state: JSON.parse(obj.workout_state) as WorkoutState,
    exercises: JSON.parse(obj.exercises) as EntityState<Exercise>,
    sets: JSON.parse(obj.sets) as EntityState<WorkoutSet>,
    last_performed: obj.last_performed,
  };
}
