import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import {
  MetricsExercise,
  MetricsState,
  MetricsWorkout,
} from "../../types/metricsTypes";
import { RootState } from "../store";

const metricsExerciseAdapter = createEntityAdapter<MetricsExercise>({
  selectId: (exercise: MetricsExercise) => exercise.id,
});

const metricsExerciseSlice = createSlice({
  name: "metricsExercises",
  initialState: metricsExerciseAdapter.getInitialState(),
  reducers: {
    addExercise(state, action: PayloadAction<{ exercise: MetricsExercise }>) {
      metricsExerciseAdapter.addOne(state, action.payload.exercise);
    },
  },
});

const metricsWorkoutAdapter = createEntityAdapter<MetricsWorkout>({
  selectId: (workout: MetricsWorkout) => workout.id,
});

const metricsWorkoutSlice = createSlice({
  name: "metricsWorkouts",
  initialState: metricsWorkoutAdapter.getInitialState(),
  reducers: {
    addWorkout(state, action: PayloadAction<{ workout: MetricsWorkout }>) {
      metricsWorkoutAdapter.addOne(state, action.payload.workout);
    },
  },
});

const initialMetricsState: MetricsState = {
  nextMetricsExerciseId: 0,
  nextMetricsWorkoutId: 0,
};

const metricsStateSlice = createSlice({
  name: "metricsState",
  initialState: initialMetricsState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(metricsWorkoutSlice.actions.addWorkout, (state) => {
        state.nextMetricsWorkoutId += 1;
      })
      .addCase(metricsExerciseSlice.actions.addExercise, (state) => {
        state.nextMetricsExerciseId += 1;
      });
  },
});

export const metricsExerciseReducer = metricsExerciseSlice.reducer;
export const { addExercise } = metricsExerciseSlice.actions;

export const metricsWorkoutReducer = metricsWorkoutSlice.reducer;
export const { addWorkout } = metricsWorkoutSlice.actions;

export const metricsStateReducer = metricsStateSlice.reducer;

const selectExerciseMetrics = (state: RootState) => state.exerciseMetrics;
const selectWorkoutMetrics = (state: RootState) => state.workoutMetrics;
const selectMetricsState = (state: RootState) => state.metricsState;
