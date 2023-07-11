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
  workout_id: number;
  workout_state: string;
  exercises: string;
  sets: string;
  last_performed: string;
}

export interface exercisesTableRow {
  exercise_id: number;
  exercise_name: string;
  best_weight: number;
  best_reps: number;
}

export interface workoutHistoryTableRow {
  workout_history_id: number;
  workout_name: string;
  workout_time: number;
  num_prs: number;
  performed: string;
}

export interface exerciseHistoryTableRow {
  exercise_history_id: number;
  workout_history_id: number;
  exercise_name: string;
  num_sets: number;
  best_weight: number;
  best_reps: number;
}
