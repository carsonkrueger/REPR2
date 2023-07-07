import { EntityState } from "@reduxjs/toolkit";
import { Exercise, WorkoutSet, WorkoutState } from "./workoutTypes";

export interface workoutsTableRow {
  workout_id: number;
  workout_state: WorkoutState;
  exercises: EntityState<Exercise>;
  sets: EntityState<WorkoutSet>;
  last_performed: string;
}
