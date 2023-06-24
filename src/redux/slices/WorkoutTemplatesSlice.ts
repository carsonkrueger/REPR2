import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { WorkoutTemplate } from "../../types/workoutTypes";

const initialWorkoutTemplate: WorkoutTemplate = {
  workoutId: 0,
  workoutName: "",
  exerciseNames: [""],
  lastPerfromed: "",
};

const initialState: WorkoutTemplate[] = [];

export const WorkoutTemplatesSlice = createSlice({
  name: "workoutTemplates",
  initialState: initialState,
  reducers: {
    addWorkoutTemplate: (state: WorkoutTemplate[]) => {
      state.push(initialWorkoutTemplate);
    },
    delWorkoutTemplateById: (
      state: WorkoutTemplate[],
      action: PayloadAction<number>
    ) => {
      const pos = state.findIndex((wt) => wt.workoutId === action.payload);
      if (pos != -1) state.splice(pos, 1);
      else throw Error("Cannot delete workout, Id does not exist.");
    },
  },
});

export const workoutTemplatesReducer = WorkoutTemplatesSlice.reducer;
export const { addWorkoutTemplate, delWorkoutTemplateById } =
  WorkoutTemplatesSlice.actions;
