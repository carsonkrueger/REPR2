import {
  WorkoutAction,
  WorkoutActionTypes,
} from "../../types/workoutActionTypes";

export function AddExercise(): WorkoutAction {
  return {
    type: WorkoutActionTypes.ADD_EXERCISE,
  };
}

export function DelExercise(exerciseIndex: number): WorkoutAction {
  return {
    type: WorkoutActionTypes.DEL_EXERCISE,
    payload: {
      exerciseIndex: exerciseIndex,
    },
  };
}

export function AddSet(exerciseIndex: number): WorkoutAction {
  return {
    type: WorkoutActionTypes.ADD_SET,
    payload: {
      exerciseIndex: exerciseIndex,
    },
  };
}

export function DelSet(exerciseIndex: number): WorkoutAction {
  return {
    type: WorkoutActionTypes.DEL_SET,
    payload: {
      exerciseIndex: exerciseIndex,
    },
  };
}

export function ToggleFinishSet(
  exerciseIndex: number,
  setIndex: number
): WorkoutAction {
  return {
    type: WorkoutActionTypes.TOGGLE_FINISH_SET,
    payload: {
      exerciseIndex: exerciseIndex,
      setIndex: setIndex,
    },
  };
}
