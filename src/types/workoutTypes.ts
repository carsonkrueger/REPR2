export type WorkoutSet = {
  prevWeight: number;
  prevReps: number;
  weight: number;
  reps: number;
  isFinished: boolean;
};

export type Exercise = {
  name: string;
  Sets: WorkoutSet[];
  timerStartTime?: number;
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
