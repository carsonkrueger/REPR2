import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";

import { Exercise, WorkoutState, WorkoutSet } from "../../types/workoutTypes";
import { RootState } from "../store";

const initialSet: WorkoutSet = {
  id: 0,
  prevWeight: 0,
  prevReps: 0,
  isFinished: false,
  reps: 0,
  weight: 0,
};
export const workoutSetAdapter = createEntityAdapter<WorkoutSet>({
  selectId: (set: WorkoutSet) => set.id,
});
const workoutSetAdapterInitialState = workoutSetAdapter.addOne(
  workoutSetAdapter.getInitialState(),
  initialSet
);

const initialExercise: Exercise = {
  id: 0,
  name: "",
  timer: 0,
  Sets: [0],
};
export const exerciseAdapter = createEntityAdapter<Exercise>({
  selectId: (workout: Exercise) => workout.id,
});
const exerciseAdapterInitialState = exerciseAdapter.addOne(
  exerciseAdapter.getInitialState(),
  initialExercise
);

const initialWorkout: WorkoutState = {
  id: 0,
  name: "",
  isLocked: false,
  inProgress: false,
};

export const workoutSetSlice = createSlice({
  name: "sets",
  initialState: workoutSetAdapterInitialState,
  reducers: {
    addSet(
      state,
      action: PayloadAction<{ exerciseId: number; nextSetId: number }>
    ) {
      workoutSetAdapter.addOne(state, {
        ...initialSet,
        id: action.payload.nextSetId,
      });
    },
    delSet(
      state,
      action: PayloadAction<{ exerciseId: number; setId: number }>
    ) {
      workoutSetAdapter.removeOne(state, action.payload.setId);
    },
    toggleFinishSet(state, action: PayloadAction<{ setId: number }>) {
      const prevBool = state.entities[action.payload.setId]?.isFinished;
      workoutSetAdapter.updateOne(state, {
        id: action.payload.setId,
        changes: { isFinished: !prevBool },
      });
    },
    setReps(state, action: PayloadAction<{ setId: number; reps: number }>) {
      workoutSetAdapter.updateOne(state, {
        id: action.payload.setId,
        changes: { reps: action.payload.reps },
      });
    },
    setWeight(state, action: PayloadAction<{ setId: number; weight: number }>) {
      workoutSetAdapter.updateOne(state, {
        id: action.payload.setId,
        changes: { weight: action.payload.weight },
      });
    },
  },
});

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState: exerciseAdapterInitialState,
  reducers: {
    addExercise(state) {
      exerciseAdapter.addOne(state, initialExercise);
    },
    delExercise(state, action: PayloadAction<{ id: number }>) {
      if (state.ids.length <= 1)
        exerciseAdapter.updateOne(state, {
          id: action.payload.id,
          changes: initialExercise,
        });
      else exerciseAdapter.removeOne(state, action.payload.id);
    },
    setInitTimer(state, action: PayloadAction<{ id: number; timer: number }>) {
      exerciseAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { timer: action.payload.timer },
      });
    },
    setExerciseName(
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) {
      exerciseAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { name: action.payload.name },
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(workoutSetSlice.actions.addSet, (state, action) => {
        state.entities[action.payload.exerciseId]?.Sets.push(
          action.payload.nextSetId
        );
      })
      .addCase(workoutSetSlice.actions.delSet, (state, action) => {
        state.entities[action.payload.exerciseId]?.Sets.pop();
      });
  },
});

const workoutSlice = createSlice({
  name: "workout",
  initialState: initialWorkout,
  reducers: {
    setName(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
    },
    toggleLock(state) {
      state.isLocked = !state.isLocked;
    },
    resetWorkout() {
      return initialWorkout;
    },
    startWorkout(state) {
      state.inProgress = true;
    },
  },
});

export const workoutSetReducer = workoutSetSlice.reducer;
export const { addSet, delSet, setReps, setWeight, toggleFinishSet } =
  workoutSetSlice.actions;

export const exerciseReducer = exercisesSlice.reducer;
export const { addExercise, delExercise, setExerciseName, setInitTimer } =
  exercisesSlice.actions;

export const workoutReducer = workoutSlice.reducer;
export const { resetWorkout, setName, toggleLock, startWorkout } =
  workoutSlice.actions;

// SELECTORS
export const selectSets = (state: RootState) => state.workoutSets;
export const selectSetById = createSelector(
  [selectSets, (_, setId: number) => setId],
  (setsState, setId) => setsState.entities[setId]
);

export const selectExercises = (state: RootState) => state.exercises;
export const selectExerciseByIndex = createSelector(
  [selectExercises, (_, exerciseId: number) => exerciseId],
  (exercises, exerciseId) => exercises.entities[exerciseId]
);

export const selectWorkout = (state: RootState) => state.workout;
export const selectIsLocked = createSelector(
  selectWorkout,
  (workout) => workout.isLocked
);
export const selectInProgress = createSelector(
  selectWorkout,
  (workout) => workout.inProgress
);
