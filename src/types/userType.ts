export interface User {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  numFollowers: number;
  numFollowing: number;
  numPosts: number;
  postIds: string[];
  isPremium: boolean;
  isFollowing: boolean;
}
