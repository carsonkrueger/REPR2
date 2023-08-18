import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { WorkoutTemplate } from "../../types/workoutTypes";
import { RootState } from "../store";
import { supabase } from "../../types/supabaseClient";
import {
  parsedWorkoutsTableRow,
  unparsedWorkoutsTableRow,
} from "../../types/localDBTables";
import { v4 as uuid } from "uuid";

const initialWorkoutTemplate: WorkoutTemplate = {
  workoutId: -1,
  workoutName: "",
  exerciseNames: [""],
  lastPerfromed: "",
};

const initialState: WorkoutTemplate[] = [];

export const shareWorkoutTemplate = createAsyncThunk(
  "shareWorkoutTemplate",
  async (payload: { template: unparsedWorkoutsTableRow; userId: string }) => {
    const templateUuid = uuid();
    const templateRes = await supabase.from("workout_templates").insert({
      template_id: templateUuid,
      user_id: payload.userId,
      workout_state: JSON.parse(payload.template.workout_state),
      exercises: JSON.parse(payload.template.exercises),
      sets: JSON.parse(payload.template.sets),
    });
    if (templateRes.error) console.error(templateRes.error);

    const postRes = await supabase.from("posts").insert({
      user_id: payload.userId,
      content_id: templateUuid,
      content_type: 2,
    });
    if (postRes.error) console.error(postRes.error);
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
