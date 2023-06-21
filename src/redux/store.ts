import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from "./slices/workoutSlice";
import { workoutTemplatesReducer } from "./slices/WorkoutTemplatesSlice";
import { settingsReducer } from "./slices/settingsSlice";

export const store = configureStore({
  reducer: {
    workout: workoutReducer,
    workoutTemplates: workoutTemplatesReducer,
    settings: settingsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
