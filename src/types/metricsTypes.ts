import { EntityId } from "@reduxjs/toolkit";

export interface MetricsState {
  nextMetricsWorkoutId: number;
  nextMetricsExerciseId: number;
}

export interface MetricsWorkout {
  id: EntityId;
  workout_history_id: number;
  workout_name: string;
  workout_time: number;
  num_prs: number;
  performed: string;
  exerciseIds: EntityId[];
}

export interface MetricsExercise {
  id: EntityId;
  exercise_history_id: number;
  workout_history_id: number;
  exercise_name: string;
  num_sets: number;
  best_weight: number;
  best_reps: number;
}
