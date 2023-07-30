import { EntityId } from "@reduxjs/toolkit";

export interface Post {
  id: EntityId;
  postId: string;
  uri: string;
  userId: string;
  createdAt: string;
  numLikes: number;
  isLiked: boolean;
  description?: string;
}
