export type WorkoutSet = {
  prevSet?: string;
  weight: number;
  reps: number;
  isFinished: boolean;
};

export type Exercise = {
  name: string;
  Sets: WorkoutSet[];
  timer: number;
};

export type Workout = {
  id: number;
  name: string;
  isLocked: boolean;
  Exercises: Exercise[];
};

export type WorkoutTemplate = {
  workoutId: number;
  workoutName: string;
  exerciseNames: string[];
  lastPerfromed: string;
};
