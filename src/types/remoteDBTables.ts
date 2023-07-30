export interface profilesTableRow {
  user_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  is_premium: boolean;
  num_posts: number;
  num_followers: number;
  num_following: number;
}

export interface userMetaData {
  first_name: string;
  last_name: string;
  user_name: string;
}

export interface postsTableRow {
  post_id: string;
  created_at: string;
  image_url: string;
  user_id: string;
  num_likes: number;
  description?: string;
}

export interface likesTableRow {
  like_id: string;
  post_id: string;
  user_id: string;
  liked_at: string;
}

export interface followingTableRow {
  follow_id: string;
  user_id: string;
  followed_user_id: string;
}
