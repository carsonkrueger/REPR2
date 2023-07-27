import { EntityId } from "@reduxjs/toolkit";

export interface Post {
  id: EntityId;
  postId: string;
  uri: string;
  userName: string;
  userId: string;
  createAt: string;
  numLikes: number;
  isLiked: boolean;
}

export interface PostsState {
  nextPostEntityId: number;
}
