import { EntityId } from "@reduxjs/toolkit";

export interface User {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  numFollowers: number;
  numFollowing: number;
  numPosts: number;
  isPremium: boolean;
  isFollowing: boolean;
}
