import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Exercise, Workout, WorkoutSet } from "../../types/workoutTypes";

const initialSet: WorkoutSet = {
  prevWeight: 0,
  prevReps: 0,
  isFinished: false,
  reps: 0,
  weight: 0,
};

const initialExercise: Exercise = {
  name: "",
  timer: 0,
  Sets: [initialSet],
};

const initialState: Workout | null = {
  id: 0,
  name: "",
  Exercises: [initialExercise],
  isLocked: false,
};

export const workoutsSlice = createSlice({
  name: "workout",
  initialState: initialState,
  reducers: {
    addExercise: (state: Workout) => {
      state.Exercises = [...state.Exercises, initialExercise];
    },
    delExercise: (state: Workout, action: PayloadAction<number>) => {
      if (state.Exercises.length <= 1)
        state.Exercises = [{ ...initialExercise }];
      else state.Exercises.splice(action.payload, 1);
    },
    addSet: (state: Workout, action: PayloadAction<number>) => {
      state.Exercises[action.payload].Sets = [
        ...state.Exercises[action.payload].Sets,
        initialSet,
      ];
    },
    delSet: (state: Workout, action: PayloadAction<number>) => {
      if (state.Exercises[action.payload].Sets.length <= 1)
        state.Exercises[action.payload].Sets = [{ ...initialSet }];
      else state.Exercises[action.payload].Sets.pop();
    },
    toggleFinishSet: (
      state: Workout,
      action: PayloadAction<[number, number]>
    ) => {
      let prevBool =
        state.Exercises[action.payload[0]].Sets[action.payload[1]].isFinished;
      state.Exercises[action.payload[0]].Sets[action.payload[1]].isFinished =
        !prevBool;
    },
    toggleLock: (state: Workout) => {
      state.isLocked = !state.isLocked;
    },
    setWorkoutName: (state: Workout, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setExerciseName: (
      state: Workout,
      action: PayloadAction<[number, string]>
    ) => {
      state.Exercises[action.payload[0]].name = action.payload[1];
    },
    setWeight: (
      state: Workout,
      action: PayloadAction<[number, number, number]>
    ) => {
      state.Exercises[action.payload[0]].Sets[action.payload[1]].weight =
        action.payload[2];
    },
    setReps: (
      state: Workout,
      action: PayloadAction<[number, number, number]>
    ) => {
      state.Exercises[action.payload[0]].Sets[action.payload[1]].reps =
        action.payload[2];
    },
    clear: (state: Workout | null) => {
      state = null;
    },
  },
});

export const workoutReducer = workoutsSlice.reducer;
export const {
  addExercise,
  delExercise,
  addSet,
  delSet,
  toggleLock,
  toggleFinishSet,
  setWorkoutName,
  setExerciseName,
  setWeight,
  setReps,
} = workoutsSlice.actions;
