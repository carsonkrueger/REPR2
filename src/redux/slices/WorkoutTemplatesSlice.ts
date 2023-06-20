import { createSlice } from "@reduxjs/toolkit";

import { WorkoutTemplate } from "../../types/workoutTypes";
import { WorkoutTemplateAction } from "../../types/workoutActionTypes";

const initialState: WorkoutTemplate[] = [
  {
    workoutId: 0,
    workoutName: "",
    exerciseNames: [""],
    lastPerfromed: "",
  },
];

export const WorkoutTemplatesSlice = createSlice({
  name: "workout",
  initialState: initialState,
  reducers: {
    addWorkout: (state: WorkoutTemplate[], action: WorkoutTemplateAction) => {
      if (!action.payload?.workout)
        throw Error("Action addWorkout requires workout payload.");
      state.push(action.payload?.workout);
    },
    delWorkout: (state: WorkoutTemplate[], action: WorkoutTemplateAction) => {
      if (!action.payload?.workoutId)
        throw Error("Action addWorkout requires workout payload.");
      const pos = state.findIndex(
        (wt) => wt.workoutId === action.payload?.workoutId
      );
      if (pos != -1) state.splice(pos, 1);
      else throw Error("Cannot delete workout, Id does not exist.");
    },
  },
});

export const workoutTemplatesReducer = WorkoutTemplatesSlice.reducer;
export const { addWorkout, delWorkout } = WorkoutTemplatesSlice.actions;
