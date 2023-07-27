import { EntityId } from "@reduxjs/toolkit";
import { Post } from "../types/postTypes";
import { postsTableRow } from "../types/remoteDBTables";

export default function postFromPostTableRow(
  row: postsTableRow,
  entityId: EntityId
): Post {
  return {
    id: entityId,
    postId: row.post_id,
    createAt: row.created_at,
    userId: row.user_id,
    numLikes: row.num_likes,
    uri: "",
    userName: "",
    isLiked: false,
  };
}
