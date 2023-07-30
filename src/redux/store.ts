import { configureStore } from "@reduxjs/toolkit";
import {
  exerciseReducer,
  workoutSetReducer,
  workoutReducer,
} from "./slices/workoutSlice";
import { workoutTemplatesReducer } from "./slices/WorkoutTemplatesSlice";
import { profileReducer } from "./slices/profileSlice";
import {
  exerciseMetricsReducer,
  metricsStateReducer,
  workoutMetricsReducer,
} from "./slices/metricsSlice";
import { postsReducer } from "./slices/postsSlice";
import { usersReducer } from "./slices/usersSlice";

export const store = configureStore({
  reducer: {
    workoutSets: workoutSetReducer,
    exercises: exerciseReducer,
    workout: workoutReducer,
    workoutTemplates: workoutTemplatesReducer,
    profile: profileReducer,
    exerciseMetrics: exerciseMetricsReducer,
    workoutMetrics: workoutMetricsReducer,
    metricsState: metricsStateReducer,
    posts: postsReducer,
    users: usersReducer,
    // postsState: postsStateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
