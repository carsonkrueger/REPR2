import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
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
  selectId: (exercise: Exercise) => exercise.id,
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
  nextSetId: 1,
};

export const workoutSetSlice = createSlice({
  name: "sets",
  initialState: workoutSetAdapterInitialState,
  reducers: {
    addSet(
      state,
      action: PayloadAction<{ exerciseId: EntityId; nextSetId: EntityId }>
    ) {
      workoutSetAdapter.addOne(state, {
        ...initialSet,
        id: action.payload.nextSetId,
      });
    },
    delSet(
      state,
      action: PayloadAction<{ exerciseId: EntityId; setId: EntityId }>
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
    setReps(state, action: PayloadAction<{ setId: EntityId; reps: number }>) {
      workoutSetAdapter.updateOne(state, {
        id: action.payload.setId,
        changes: { reps: action.payload.reps },
      });
    },
    setWeight(
      state,
      action: PayloadAction<{ setId: EntityId; weight: number }>
    ) {
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
    delExercise(state, action: PayloadAction<{ id: EntityId }>) {
      if (state.ids.length <= 1)
        exerciseAdapter.updateOne(state, {
          id: action.payload.id,
          changes: initialExercise,
        });
      else exerciseAdapter.removeOne(state, action.payload.id);
    },
    setInitTimer(
      state,
      action: PayloadAction<{ id: EntityId; timer: number }>
    ) {
      exerciseAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { timer: action.payload.timer },
      });
    },
    toggleTimer(state, action: PayloadAction<{ exerciseId: EntityId }>) {
      const newStartTime = state.entities[action.payload.exerciseId]
        ?.timerStartTime
        ? undefined
        : Date.now() / 1000;
      exerciseAdapter.updateOne(state, {
        id: action.payload.exerciseId,
        changes: { timerStartTime: newStartTime },
      });
    },
    setExerciseName(
      state,
      action: PayloadAction<{ id: EntityId; name: string }>
    ) {
      exerciseAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { name: action.payload.name },
      });
    },
    swapExerciseWithBelow(state, action: PayloadAction<{ id: EntityId }>) {
      const pos = state.ids.findIndex(
        (entityId) => entityId === action.payload.id
      );
      if (pos < state.ids.length - 1 || pos > -1) {
        state.ids[pos] = state.ids[pos + 1];
        state.ids[pos + 1] = action.payload.id;
      }
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
export const {
  addExercise,
  delExercise,
  setExerciseName,
  setInitTimer,
  toggleTimer,
  swapExerciseWithBelow,
} = exercisesSlice.actions;

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
