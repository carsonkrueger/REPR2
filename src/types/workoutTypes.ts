export type WorkoutSet = {
  setIndex: number;
  prevSet?: string;
  weight: number;
  reps: number;
  isFinished: boolean;
};

export type Exercise = {
  exerciseIndex: number;
  name: string;
  Sets: WorkoutSet[];
  timer: number;
};

export type Workout = {
  name: string;
  isLocked: boolean;
  Exercises: Exercise[];
};
