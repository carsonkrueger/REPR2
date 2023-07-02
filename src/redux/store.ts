import { configureStore } from "@reduxjs/toolkit";
import {
  exerciseReducer,
  workoutSetReducer,
  workoutReducer,
} from "./slices/workoutSlice";
import { workoutTemplatesReducer } from "./slices/WorkoutTemplatesSlice";
import { profileReducer } from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    workoutSets: workoutSetReducer,
    exercises: exerciseReducer,
    workout: workoutReducer,
    workoutTemplates: workoutTemplatesReducer,
    profile: profileReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
