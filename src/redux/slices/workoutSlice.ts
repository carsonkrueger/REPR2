import { createSlice } from "@reduxjs/toolkit";

import { Exercise, Workout, WorkoutSet } from "../../types/workoutTypes";
import { WorkoutAction } from "../../types/workoutActionTypes";

const initialSet: WorkoutSet = {
  isFinished: false,
  reps: 0,
  weight: 0,
};

const initialExercise: Exercise = {
  name: "e",
  timer: 0,
  Sets: [initialSet],
};

const initialState: Workout = {
  id: 0,
  name: "w",
  Exercises: [initialExercise],
  isLocked: false,
};

export const workoutsSlice = createSlice({
  name: "workout",
  initialState: initialState,
  reducers: {
    addExercise: (state: Workout, action: WorkoutAction) => {
      state.Exercises = [...state.Exercises, initialExercise];
    },
    delExercise: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error("Action DEL_EXERCISE requires exercise index payload.");
      state.Exercises.splice(action.payload?.exerciseIndex, 1);
      // let newExercises = [...state.Exercises];
      // newExercises.splice(action.payload?.exerciseIndex, 1);
      // state.Exercises = newExercises;
    },
    addSet: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error("Action ADD_SET requires exercise index payload.");
      state.Exercises[action.payload.exerciseIndex].Sets = [
        ...state.Exercises[action.payload.exerciseIndex].Sets,
        initialSet,
      ];
    },
    delSet: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error("Action DEL_SET requires exercise index payload.");
      state.Exercises[action.payload.exerciseIndex].Sets.pop();
      // let newSets = [...state.Exercises[action.payload.exerciseIndex].Sets];
      // newSets.pop();
      // state.Exercises[action.payload.exerciseIndex].Sets = newSets;
    },
    toggleFinishSet: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error(
          "Action TOGGLE_FINISH_SET requires exercise index payload."
        );
      else if (!action.payload?.setIndex)
        throw Error("Action TOGGLE_FINISH_SET requires set index payload.");
      let prevBool =
        state.Exercises[action.payload.exerciseIndex].Sets[
          action.payload.setIndex
        ].isFinished;
      state.Exercises[action.payload.exerciseIndex].Sets[
        action.payload.setIndex
      ].isFinished = !prevBool;
    },
  },
});

export const workoutReducer = workoutsSlice.reducer;
export const { addExercise, delExercise, addSet, delSet, toggleFinishSet } =
  workoutsSlice.actions;
