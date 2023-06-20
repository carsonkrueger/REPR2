export const WorkoutActionTypes = {
  ADD_EXERCISE: "ADD_EXERCISE",
  DEL_EXERCISE: "DEL_EXERCISE",
  SWAP_EXERCISE: "SWAP_EXERCISE",
  ADD_SET: "ADD_SET",
  DEL_SET: "DEL_SET",
  TOGGLE_FINISH_SET: "TOGGLE_FINISH_SET",
};

export type WorkoutAction = {
  type: string;
  payload?: {
    exerciseIndex?: number;
    setIndex?: number;
  };
};
