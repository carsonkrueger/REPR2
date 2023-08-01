export interface Post {
  postId: string;
  uri: string;
  userId: string;
  createdAt: string;
  numLikes: number;
  isLiked: boolean;
  description?: string;
}
