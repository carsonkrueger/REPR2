import { EntityState } from "@reduxjs/toolkit";
import { Exercise, WorkoutSet, WorkoutState } from "./workoutTypes";

export interface Post {
  postId: string;
  contentId?: string;
  contentType: number;
  userId: string;
  createdAt: string;
  numLikes: number;
  isLiked: boolean;
  description?: string;
  base64Image?: string;
  sharedTemplate?: {
    workoutState: WorkoutState;
    exercises: EntityState<Exercise>;
    sets: EntityState<WorkoutSet>;
  };
}
