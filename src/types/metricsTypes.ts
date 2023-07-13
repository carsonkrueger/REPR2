import { EntityId } from "@reduxjs/toolkit";

export interface MetricsState {
  workoutIds: EntityId[];
}

export interface WorkoutMetric {
  workoutHistoryId: EntityId;
  workoutName: string;
  workoutTime: number;
  numPrs: number;
  performed: string;
  exerciseIds: EntityId[];
}

export interface ExerciseMetric {
  exerciseHistoryId: EntityId;
  workoutHistoryId: EntityId;
  exerciseName: string;
  numSets: number;
  bestWeight: number;
  bestReps: number;
}
