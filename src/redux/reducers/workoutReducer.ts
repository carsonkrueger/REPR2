import { Exercise, Workout, WorkoutSet } from "../../types/workoutTypes";
import {
  WorkoutAction,
  WorkoutActionTypes,
} from "../../types/workoutActionTypes";

const initialSet: WorkoutSet = {
  setIndex: 0,
  isFinished: false,
  reps: 0,
  weight: 0,
};

const initialExercise: Exercise = {
  exerciseIndex: 0,
  name: "",
  timer: 0,
  Sets: [initialSet],
};

const initialState: Workout = {
  name: "",
  Exercises: [initialExercise],
  isLocked: false,
};

export default function WorkoutReducer(
  state: Workout = initialState,
  action: WorkoutAction
) {
  switch (action.type) {
    case WorkoutActionTypes.ADD_EXERCISE: {
      let newState = { ...state };
      newState.Exercises.push(initialExercise);
      return { newState };
    }
    case WorkoutActionTypes.DEL_EXERCISE: {
      if (!action.payload?.exerciseIndex)
        throw Error("Action DEL_EXERCISE requires exercise index payload.");
      let newState = { ...state };
      newState.Exercises.splice(action.payload?.exerciseIndex, 1);
      return { newState };
    }
    case WorkoutActionTypes.ADD_SET: {
      if (!action.payload?.exerciseIndex)
        throw Error("Action ADD_SET requires exercise index payload.");
      let newState = { ...state };
      newState.Exercises[action.payload.exerciseIndex].Sets.push(initialSet);
      return { newState };
    }
    case WorkoutActionTypes.DEL_SET: {
      if (!action.payload?.exerciseIndex)
        throw Error("Action DEL_SET requires exercise index payload.");
      let newState = { ...state };
      newState.Exercises[action.payload.exerciseIndex].Sets.pop();
      return { newState };
    }
    case WorkoutActionTypes.TOGGLE_FINISH_SET: {
      if (!action.payload?.exerciseIndex)
        throw Error(
          "Action TOGGLE_FINISH_SET requires exercise index payload."
        );
      else if (!action.payload?.setIndex)
        throw Error("Action TOGGLE_FINISH_SET requires set index payload.");
      let newState = { ...state };
      newState.Exercises[action.payload.exerciseIndex].Sets[
        action.payload.setIndex
      ].isFinished =
        !newState.Exercises[action.payload.exerciseIndex].Sets[
          action.payload.setIndex
        ].isFinished;
      return { newState };
    }
  }
}
