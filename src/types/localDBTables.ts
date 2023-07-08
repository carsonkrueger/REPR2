import { EntityState } from "@reduxjs/toolkit";
import { Exercise, WorkoutSet, WorkoutState } from "./workoutTypes";

export interface parsedWorkoutsTableRow {
  workout_id: number;
  workout_state: WorkoutState;
  exercises: EntityState<Exercise>;
  sets: EntityState<WorkoutSet>;
  last_performed: string;
}

export interface unparsedWorkoutsTableRow {
  workout_id: string;
  workout_state: string;
  exercises: string;
  sets: string;
  last_performed: string;
}
