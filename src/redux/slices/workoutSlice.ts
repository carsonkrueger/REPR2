import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Exercise, Workout, WorkoutSet } from "../../types/workoutTypes";
import { RootState } from "../store";

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

const initialState: Workout = {
  id: 0,
  name: "",
  Exercises: [initialExercise],
  isLocked: false,
  inProgress: false,
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
    resetWorkout: (state: Workout) => {
      state.inProgress = false;
      state.Exercises = [initialExercise];
      state.id = -1;
      state.isLocked = false;
      state.name = "";
    },
    startWorkout: (state: Workout) => {
      state.inProgress = true;
    },
    toggleTimer: (state: Workout, action: PayloadAction<number>) => {
      if (state.Exercises[action.payload].timerStartTime)
        state.Exercises[action.payload].timerStartTime = undefined;
      else state.Exercises[action.payload].timerStartTime = Date.now() / 1000;
    },
    setInitTimer: (state: Workout, action: PayloadAction<[number, number]>) => {
      state.Exercises[action.payload[0]].timer = action.payload[1];
    },
    swapExerciseWithBelow: (state: Workout, action: PayloadAction<number>) => {
      if (action.payload <= -1 || action.payload >= state.Exercises.length - 1)
        return;
      const temp = state.Exercises[action.payload];
      state.Exercises[action.payload] = state.Exercises[action.payload + 1];
      state.Exercises[action.payload + 1] = temp;
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
  resetWorkout,
  startWorkout,
  toggleTimer,
  setInitTimer,
  swapExerciseWithBelow,
} = workoutsSlice.actions;

// SELECTORS
export const selectWorkout = (state: RootState) => state.workout;
export const selectIsLocked = createSelector(
  selectWorkout,
  (workout: Workout) => workout.isLocked
);
export const selectExercises = createSelector(
  selectWorkout,
  (workout: Workout) => workout.Exercises
);
export const selectExerciseByIndex = createSelector(
  [selectExercises, (_, exerciseIndex: number) => exerciseIndex],
  (exercises: Exercise[], exerciseIndex) => exercises[exerciseIndex]
);
export const selectSetByIndex = createSelector(
  [
    selectExercises,
    (_, exerciseIndex: number, setIndex: number) => [exerciseIndex, setIndex],
  ],
  (exercises: Exercise[], [exerciseIndex, setIndex]) =>
    exercises[exerciseIndex].Sets[setIndex]
);
