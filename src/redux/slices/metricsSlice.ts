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
  selectId: (exercise: ExerciseMetric) => exercise.exerciseHistoryId,
});

const exerciseMetricsSlice = createSlice({
  name: "exerciseMetrics",
  initialState: exerciseMetricsAdapter.getInitialState(),
  reducers: {
    addExerciseHistory(
      state,
      action: PayloadAction<{
        exercise: ExerciseMetric;
      }>
    ) {
      exerciseMetricsAdapter.addOne(state, action.payload.exercise);
    },
  },
});

const workoutMetricsAdapter = createEntityAdapter<WorkoutMetric>({
  selectId: (workout: WorkoutMetric) => workout.workoutHistoryId,
});

const workoutMetricsSlice = createSlice({
  name: "workoutMetrics",
  initialState: workoutMetricsAdapter.getInitialState(),
  reducers: {
    addWorkoutHistoryToFront(
      state,
      action: PayloadAction<{ workout: WorkoutMetric }>
    ) {
      workoutMetricsAdapter.addOne(state, action.payload.workout);
    },
    addWorkoutHistoryToBack(
      state,
      action: PayloadAction<{ workout: WorkoutMetric }>
    ) {
      workoutMetricsAdapter.addOne(state, action.payload.workout);
    },
  },
  extraReducers(builder) {
    builder.addCase(
      exerciseMetricsSlice.actions.addExerciseHistory,
      (state, action) => {
        workoutMetricsAdapter.updateOne(state, {
          id: action.payload.exercise.workoutHistoryId,
          changes: {
            exerciseIds: [
              ...state.entities[action.payload.exercise.workoutHistoryId]!
                .exerciseIds,
              action.payload.exercise.exerciseHistoryId,
            ],
          },
        });
      }
    );
  },
});

const initialMetricsState: MetricsState = {
  workoutIds: [],
};

const metricsStateSlice = createSlice({
  name: "metricsState",
  initialState: initialMetricsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        workoutMetricsSlice.actions.addWorkoutHistoryToFront,
        (state, action) => {
          state.workoutIds.unshift(action.payload.workout.workoutHistoryId);
        }
      )
      .addCase(
        workoutMetricsSlice.actions.addWorkoutHistoryToBack,
        (state, action) => {
          state.workoutIds.push(action.payload.workout.workoutHistoryId);
        }
      );
  },
});

export const exerciseMetricsReducer = exerciseMetricsSlice.reducer;
export const { addExerciseHistory } = exerciseMetricsSlice.actions;

export const workoutMetricsReducer = workoutMetricsSlice.reducer;
export const { addWorkoutHistoryToFront, addWorkoutHistoryToBack } =
  workoutMetricsSlice.actions;

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
