import {
  exerciseHistoryTableRow,
  workoutHistoryTableRow,
} from "../types/localDBTables";
import { ExerciseMetric, WorkoutMetric } from "../types/metricsTypes";

export function parseWorkoutHistoryTableRow(
  workoutRow: workoutHistoryTableRow
): WorkoutMetric {
  return {
    workoutName: workoutRow.workout_name,
    workoutHistoryId: workoutRow.workout_history_id,
    exerciseIds: [],
    numPrs: workoutRow.num_prs,
    performed: workoutRow.performed,
    workoutTime: workoutRow.workout_time,
  };
}

export function parseExerciseHistoryTableRow(
  exerciseRow: exerciseHistoryTableRow
): ExerciseMetric {
  return {
    exerciseName: exerciseRow.exercise_name,
    workoutHistoryId: exerciseRow.workout_history_id,
    exerciseHistoryId: exerciseRow.exercise_history_id,
    bestReps: exerciseRow.best_reps,
    bestWeight: exerciseRow.best_weight,
    numSets: exerciseRow.num_sets,
  };
}
