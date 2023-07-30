import { EntityId } from "@reduxjs/toolkit";
import { Post } from "../types/postTypes";
import { postsTableRow, profilesTableRow } from "../types/remoteDBTables";
import { User } from "../types/userType";

export function postFromPostTableRow(
  row: postsTableRow,
  entityId: EntityId
): Post {
  return {
    id: entityId,
    postId: row.post_id,
    createdAt: row.created_at,
    userId: row.user_id,
    numLikes: row.num_likes,
    uri: "",
    isLiked: false,
    description: row.description,
  };
}

export function userFromProfileTableRow(row: profilesTableRow): User {
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
