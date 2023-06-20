import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from "./slices/workoutSlice";
import { workoutTemplatesReducer } from "./slices/WorkoutTemplatesSlice";

export const store = configureStore({
  reducer: {
    workout: workoutReducer,
    workoutTemplates: workoutTemplatesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
