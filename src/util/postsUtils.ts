import { Post } from "../types/postTypes";
import { User } from "../types/userType";

export function postFromPostTableRow(row: PostRow): Post {
  return {
    postId: row.post_id,
    createdAt: row.created_at,
    userId: row.user_id,
    numLikes: 0,
    contentId: row.content_id ?? undefined,
    contentType: row.content_type,
    isLiked: false,
    description: row.description ?? "",
  };
}

export function userFromProfileTableRow(
  row: ProfileRow,
  postIds: string[] = []
): User {
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
    postIds: postIds,
  };
}
