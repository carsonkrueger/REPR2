import { EntityId } from "@reduxjs/toolkit";

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
  id: number;
  name: string;
  isLocked: boolean;
  menuSelectedId: EntityId | undefined;
  inProgress: boolean;
  nextSetId: EntityId;
  nextExerciseId: EntityId;
  startedAt: number;
}

export interface WorkoutTemplate {
  workoutId: number;
  workoutName: string;
  exerciseNames: string[];
  lastPerfromed: string;
}
