import { configureStore } from "@reduxjs/toolkit";
import {
  exerciseReducer,
  workoutSetReducer,
  workoutReducer,
} from "./slices/workoutSlice";
import { workoutTemplatesReducer } from "./slices/WorkoutTemplatesSlice";
import { profileReducer } from "./slices/profileSlice";
import {
  metricsExerciseReducer,
  metricsStateReducer,
  metricsWorkoutReducer,
} from "./slices/metricsSlice";

export const store = configureStore({
  reducer: {
    workoutSets: workoutSetReducer,
    exercises: exerciseReducer,
    workout: workoutReducer,
    workoutTemplates: workoutTemplatesReducer,
    profile: profileReducer,
    exerciseMetrics: metricsExerciseReducer,
    workoutMetrics: metricsWorkoutReducer,
    metricsState: metricsStateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
