import { EntityId, EntityState } from "@reduxjs/toolkit";

export interface WorkoutSet {
  id: EntityId;
  prevWeight: number;
  prevReps: number;
  weight: number;
  reps: number;
  isFinished: boolean;
}

export interface Exercise {
  id: EntityId;
  name: string;
  timerStartTime?: number;
  timer: number;
  Sets: EntityId[];
}

export interface WorkoutState {
  id: EntityId;
  name: string;
  isLocked: boolean;
  inProgress: boolean;
  nextSetId: EntityId;
  nextExerciseId: EntityId;
  // Exercises: EntityState<Exercise>;
  // Sets: EntityState<WorkoutSet>;
}

export interface WorkoutTemplate {
  workoutId: number;
  workoutName: string;
  exerciseNames: string[];
  lastPerfromed: string;
}
