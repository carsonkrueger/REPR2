export interface profilesTable {
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
