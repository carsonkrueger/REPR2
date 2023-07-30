import { EntityId } from "@reduxjs/toolkit";

export interface Post {
  id: EntityId;
  postId: string;
  uri: string;
  userName: string;
  userId: string;
  createdAt: string;
  numLikes: number;
  isLiked: boolean;
  isFollowing: boolean;
  description?: string;
}

export interface PostsState {
  nextPostEntityId: number;
  lastPostDate: string;
}
