import { EntityId } from "@reduxjs/toolkit";

export interface MetricsState {
  nextMetricsWorkoutId: number;
  nextMetricsExerciseId: number;
  workoutIds: EntityId[];
}

export interface WorkoutMetric {
  id: EntityId;
  workoutHistoryId: number;
  workoutName: string;
  workoutTime: number;
  numPrs: number;
  performed: string;
  exerciseIds: EntityId[];
}

export interface ExerciseMetric {
  id: EntityId;
  exerciseHistory_id: number;
  workoutHistory_id: number;
  exerciseName: string;
  numSets: number;
  bestWeight: number;
  bestReps: number;
}
