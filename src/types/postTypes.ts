export interface Post {
  postId: string;
  imageId?: string;
  sharedWorkoutId?: string;
  userId: string;
  createdAt: string;
  numLikes: number;
  isLiked: boolean;
  description?: string;
  base64Image?: string;
}
