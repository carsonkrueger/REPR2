import { createSlice } from "@reduxjs/toolkit";

import { Exercise, Workout, WorkoutSet } from "../../types/workoutTypes";
import { WorkoutAction } from "../../types/workoutActionTypes";

const initialSet: WorkoutSet = {
  setIndex: 0,
  isFinished: false,
  reps: 0,
  weight: 0,
};

const initialExercise: Exercise = {
  exerciseIndex: 0,
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
      let newExercises = state.Exercises;
      newExercises.push(initialExercise);
      return { ...state, Exercises: newExercises };
    },
    delExercise: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error("Action DEL_EXERCISE requires exercise index payload.");
      let newExercises = state.Exercises;
      newExercises.splice(action.payload?.exerciseIndex, 1);
      return { ...state, Exercises: newExercises };
    },
    addSet: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error("Action ADD_SET requires exercise index payload.");
      let newExercises = state.Exercises;
      newExercises[action.payload.exerciseIndex].Sets.push(initialSet);
      return { ...state, Exercises: newExercises };
    },
    delSet: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error("Action DEL_SET requires exercise index payload.");
      let newExercises = state.Exercises;
      newExercises[action.payload.exerciseIndex].Sets.pop();
      return { ...state };
    },
    toggleFinishSet: (state: Workout, action: WorkoutAction) => {
      if (!action.payload?.exerciseIndex)
        throw Error(
          "Action TOGGLE_FINISH_SET requires exercise index payload."
        );
      else if (!action.payload?.setIndex)
        throw Error("Action TOGGLE_FINISH_SET requires set index payload.");
      let newExercises = state.Exercises;
      newExercises[action.payload.exerciseIndex].Sets[
        action.payload.setIndex
      ].isFinished =
        !newExercises[action.payload.exerciseIndex].Sets[
          action.payload.setIndex
        ].isFinished;
      return { ...state, Exercises: newExercises };
    },
  },
});

export const workoutReducer = workoutsSlice.reducer;
export const { addExercise, delExercise, addSet, delSet, toggleFinishSet } =
  workoutsSlice.actions;
