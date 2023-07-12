import {
  EntityId,
  PayloadAction,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  ExerciseMetric,
  MetricsState,
  WorkoutMetric,
} from "../../types/metricsTypes";
import { RootState } from "../store";

const exerciseMetricsAdapter = createEntityAdapter<ExerciseMetric>({
  selectId: (exercise: ExerciseMetric) => exercise.id,
});

const exerciseMetricsSlice = createSlice({
  name: "exerciseMetrics",
  initialState: exerciseMetricsAdapter.getInitialState(),
  reducers: {
    addExercise(
      state,
      action: PayloadAction<{
        exercise: ExerciseMetric;
        workoutId: number;
        nextExerciseId: number;
      }>
    ) {
      exerciseMetricsAdapter.addOne(state, action.payload.exercise);
    },
  },
});

const workoutMetricsAdapter = createEntityAdapter<WorkoutMetric>({
  selectId: (workout: WorkoutMetric) => workout.id,
});

const workoutMetricsSlice = createSlice({
  name: "workoutMetrics",
  initialState: workoutMetricsAdapter.getInitialState(),
  reducers: {
    addWorkout(state, action: PayloadAction<{ workout: WorkoutMetric }>) {
      workoutMetricsAdapter.addOne(state, action.payload.workout);
    },
  },
  extraReducers(builder) {
    builder.addCase(
      exerciseMetricsSlice.actions.addExercise,
      (state, action) => {
        workoutMetricsAdapter.updateOne(state, {
          id: action.payload.workoutId,
          changes: {
            exerciseIds: [
              ...state.entities[action.payload.workoutId]!.exerciseIds,
              action.payload.nextExerciseId,
            ],
          },
        });
      }
    );
  },
});

const initialMetricsState: MetricsState = {
  nextMetricsExerciseId: 0,
  nextMetricsWorkoutId: 0,
  workoutIds: [],
};

const metricsStateSlice = createSlice({
  name: "metricsState",
  initialState: initialMetricsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(workoutMetricsSlice.actions.addWorkout, (state) => {
        state.workoutIds.push(state.nextMetricsWorkoutId);
        state.nextMetricsWorkoutId += 1;
      })
      .addCase(exerciseMetricsSlice.actions.addExercise, (state) => {
        state.nextMetricsExerciseId += 1;
      });
  },
});

export const exerciseMetricsReducer = exerciseMetricsSlice.reducer;
export const { addExercise } = exerciseMetricsSlice.actions;

export const workoutMetricsReducer = workoutMetricsSlice.reducer;
export const { addWorkout } = workoutMetricsSlice.actions;

export const metricsStateReducer = metricsStateSlice.reducer;

export const selectExerciseMetrics = (state: RootState) =>
  state.exerciseMetrics;
export const selectWorkoutMetrics = (state: RootState) => state.workoutMetrics;
export const selectMetricsState = (state: RootState) => state.metricsState;

export const selectExerciseMetricById = createSelector(
  [selectExerciseMetrics, (_, exerciseId: EntityId) => exerciseId],
  (exerciseMetrics, exerciseId) => exerciseMetrics.entities[exerciseId]
);
export const selectWorkoutMetricById = createSelector(
  [selectWorkoutMetrics, (_, workoutId: EntityId) => workoutId],
  (workoutMetrics, workoutId) => workoutMetrics.entities[workoutId]
);
