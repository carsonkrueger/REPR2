import { EntityId } from "@reduxjs/toolkit";

export interface Post {
  id: EntityId;
  postId: string;
  uri: string;
  userName: string;
  userId: string;
  createAt: string;
}

export interface PostsState {
  nextPostEntityId: number;
}
