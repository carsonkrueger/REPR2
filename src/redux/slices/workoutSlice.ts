import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
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
  selectId: (exercise: Exercise) => exercise.id,
});
const exerciseAdapterInitialState = exerciseAdapter.addOne(
  exerciseAdapter.getInitialState(),
  initialExercise
);

const initialWorkout: WorkoutState = {
  // id: -1,
  name: "",
  isLocked: false,
  inProgress: false,
  nextSetId: 1,
  nextExerciseId: 1,
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
      action: PayloadAction<{
        exerciseId: EntityId;
        setId: EntityId;
        numSets: number;
      }>
    ) {
      if (action.payload.numSets <= 1)
        workoutSetAdapter.updateOne(state, {
          id: action.payload.setId,
          changes: { ...initialSet, id: action.payload.setId },
        });
      else workoutSetAdapter.removeOne(state, action.payload.setId);
    },
    toggleFinishSet(state, action: PayloadAction<{ setId: EntityId }>) {
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
    setSets(state, action: PayloadAction<EntityState<WorkoutSet>>) {
      state.entities = action.payload.entities;
      state.ids = action.payload.ids;
    },
    cleanSets(state) {
      state.ids.map((setId) =>
        workoutSetAdapter.updateOne(state, {
          id: setId,
          changes: {
            isFinished: false,
            weight: 0,
            reps: 0,
            prevWeight:
              state.entities[setId]?.weight === 0
                ? state.entities[setId]?.prevWeight
                : state.entities[setId]?.weight,
            prevReps:
              state.entities[setId]?.reps === 0
                ? state.entities[setId]?.prevReps
                : state.entities[setId]?.reps,
          },
        })
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(exercisesSlice.actions.addExercise, (state, action) => {
        workoutSetAdapter.addOne(state, {
          ...initialSet,
          id: action.payload.nextSetId,
        });
      })
      .addCase(workoutSlice.actions.resetWorkout, (state) => {
        workoutSetAdapter.removeAll(state);
        workoutSetAdapter.addOne(state, {
          ...initialSet,
        });
      });
  },
});

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState: exerciseAdapterInitialState,
  reducers: {
    addExercise(
      state,
      action: PayloadAction<{ nextExerciseId: EntityId; nextSetId: EntityId }>
    ) {
      exerciseAdapter.addOne(state, {
        ...initialExercise,
        id: action.payload.nextExerciseId,
        Sets: [action.payload.nextSetId],
      });
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
      if (pos >= state.ids.length - 1 || pos <= -1) return;
      state.ids[pos] = state.ids[pos + 1];
      state.ids[pos + 1] = action.payload.id;
    },
    swapExerciseWithAbove(state, action: PayloadAction<{ id: EntityId }>) {
      const pos = state.ids.findIndex(
        (entityId) => entityId === action.payload.id
      );
      if (pos > state.ids.length || pos <= 0) return;
      state.ids[pos] = state.ids[pos - 1];
      state.ids[pos - 1] = action.payload.id;
    },
    setExercises(state, action: PayloadAction<EntityState<Exercise>>) {
      state.entities = action.payload.entities;
      state.ids = action.payload.ids;
    },
    cleanExercises(state) {
      state.ids.map((exId) =>
        exerciseAdapter.updateOne(state, {
          id: exId,
          changes: { timerStartTime: undefined },
        })
      );
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
        if (action.payload.numSets > 1)
          state.entities[action.payload.exerciseId]?.Sets.pop();
      })
      .addCase(workoutSlice.actions.resetWorkout, (state) => {
        exerciseAdapter.removeAll(state);
        exerciseAdapter.addOne(state, {
          ...initialExercise,
        });
      });
  },
});

const workoutSlice = createSlice({
  name: "workout",
  initialState: initialWorkout,
  reducers: {
    setWorkoutName(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
    },
    // setWorkoutId(state, action: PayloadAction<{ id: number }>) {
    //   state.id = action.payload.id;
    // },
    toggleLock(state) {
      state.isLocked = !state.isLocked;
    },
    resetWorkout(state) {
      // state.id = initialWorkout.id;
      state.inProgress = initialWorkout.inProgress;
      state.isLocked = initialWorkout.isLocked;
      state.name = initialWorkout.name;
      state.nextExerciseId = initialWorkout.nextExerciseId;
      state.nextSetId = initialWorkout.nextSetId;
    },
    startInProgress(state) {
      state.inProgress = true;
    },
    setWorkout(state, action: PayloadAction<WorkoutState>) {
      // state.id = action.payload.id;
      state.inProgress = action.payload.inProgress;
      state.isLocked = action.payload.isLocked;
      state.name = action.payload.name;
      state.nextExerciseId = action.payload.nextExerciseId;
      state.nextSetId = action.payload.nextSetId;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(exercisesSlice.actions.addExercise, (state) => {
        if (
          typeof state.nextExerciseId === "number" &&
          typeof state.nextSetId === "number"
        ) {
          state.nextExerciseId += 1;
          state.nextSetId += 1;
        }
      })
      .addCase(workoutSetSlice.actions.addSet, (state) => {
        if (typeof state.nextSetId === "number") state.nextSetId += 1;
      });
  },
});

export const workoutSetReducer = workoutSetSlice.reducer;
export const {
  addSet,
  delSet,
  setReps,
  setWeight,
  toggleFinishSet,
  setSets,
  cleanSets,
} = workoutSetSlice.actions;

export const exerciseReducer = exercisesSlice.reducer;
export const {
  addExercise,
  delExercise,
  setExerciseName,
  setInitTimer,
  toggleTimer,
  swapExerciseWithBelow,
  swapExerciseWithAbove,
  setExercises,
  cleanExercises,
} = exercisesSlice.actions;

export const workoutReducer = workoutSlice.reducer;
export const {
  resetWorkout,
  setWorkoutName,
  toggleLock,
  startInProgress,
  setWorkout,
} = workoutSlice.actions;

// SELECTORS
export const selectSets = (state: RootState) => state.workoutSets;
export const selectSetById = createSelector(
  [selectSets, (_, setId: EntityId) => setId],
  (setsState, setId) => setsState.entities[setId] ?? initialSet
);

export const selectExercises = (state: RootState) => state.exercises;
export const selectExerciseById = createSelector(
  [selectExercises, (_, exerciseId: EntityId) => exerciseId],
  (exercises, exerciseId) => exercises.entities[exerciseId] ?? initialExercise
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
