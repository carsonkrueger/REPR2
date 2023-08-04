import { EntityId } from "@reduxjs/toolkit";
import { Post } from "../types/postTypes";
import { User } from "../types/userType";

export function postFromPostTableRow(row: PostRow): Post {
  return {
    postId: row.post_id,
    createdAt: row.created_at,
    userId: row.user_id,
    numLikes: row.num_likes,
    imageId: row.image_id ?? undefined,
    sharedWorkoutId: row.shared_workout_id ?? undefined,
    isLiked: false,
    description: row.description ?? "",
  };
}

export function userFromProfileTableRow(row: ProfileRow): User {
  return {
    userId: row.user_id,
    userName: row.user_name,
    firstName: row.first_name,
    lastName: row.last_name,
    numFollowers: row.num_followers,
    numFollowing: row.num_following,
    numPosts: row.num_posts,
    isPremium: row.is_premium,
    isFollowing: false,
  };
}
