import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { WorkoutTemplate } from "../../types/workoutTypes";

const initialWorkoutTemplate: WorkoutTemplate = {
  workoutId: -1,
  workoutName: "New Workout",
  exerciseNames: [""],
  lastPerfromed: "",
};

const initialState: WorkoutTemplate[] = [];

export const WorkoutTemplatesSlice = createSlice({
  name: "workoutTemplates",
  initialState: initialState,
  reducers: {
    addWorkoutTemplate: (
      state: WorkoutTemplate[],
      action: PayloadAction<WorkoutTemplate>
    ) => {
      state.unshift(initialWorkoutTemplate);
    },
    delWorkoutTemplateById: (
      state: WorkoutTemplate[],
      action: PayloadAction<number>
    ) => {
      const pos = state.findIndex((wt) => wt.workoutId === action.payload);
      if (pos === -1) throw Error("Cannot delete workout, Id does not exist.");
      state.splice(pos, 1);
    },
    updateWorkoutTemplate: (
      state: WorkoutTemplate[],
      action: PayloadAction<WorkoutTemplate>
    ) => {
      const templateIndex = state.findIndex(
        (template) => template.workoutId === action.payload.workoutId
      );
      if (templateIndex === -1)
        throw Error("Cannot update template, workout Id does not exist");
      state[templateIndex] = action.payload;
    },
  },
});

export const workoutTemplatesReducer = WorkoutTemplatesSlice.reducer;
export const {
  addWorkoutTemplate,
  delWorkoutTemplateById,
  updateWorkoutTemplate,
} = WorkoutTemplatesSlice.actions;
