import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { WorkoutTemplate } from "../../types/workoutTypes";
import { RootState } from "../store";
import { supabase } from "../../types/supabaseClient";

const initialWorkoutTemplate: WorkoutTemplate = {
  workoutId: -1,
  workoutName: "",
  exerciseNames: [""],
  lastPerfromed: "",
};

const initialState: WorkoutTemplate[] = [];

export const shareWorkoutTemplate = createAsyncThunk(
  "shareWorkoutTemplate",
  async (payload: { template: string; userId: string }) => {
    const { data, error } = await supabase
      .from("shared_workout_templates")
      .upsert({ user_id: payload.userId, workout_template: payload.template });

    if (error) console.error(error);
  }
);

export const WorkoutTemplatesSlice = createSlice({
  name: "workoutTemplates",
  initialState: initialState,
  reducers: {
    addWorkoutTemplateToFront: (
      state: WorkoutTemplate[],
      action: PayloadAction<WorkoutTemplate>
    ) => {
      state.unshift(action.payload);
    },
    addWorkoutTemplateToBack: (
      state: WorkoutTemplate[],
      action: PayloadAction<WorkoutTemplate>
    ) => {
      state.push(action.payload);
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
  addWorkoutTemplateToBack,
  addWorkoutTemplateToFront,
  delWorkoutTemplateById,
  updateWorkoutTemplate,
} = WorkoutTemplatesSlice.actions;

export const selectAllTemplates = (state: RootState) => state.workoutTemplates;
export const selectTemplateById = createSelector(
  [selectAllTemplates, (_, templateId) => templateId],
  (templates, templateId) =>
    templates.find((t) => t.workoutId === templateId) ?? initialWorkoutTemplate
);
