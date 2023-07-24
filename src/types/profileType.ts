import { Session } from "@supabase/supabase-js";

export type Profile = {
  userId: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  isPremium: boolean;
  num_posts: number;
  num_followers: number;
  num_following: number;
  isDarkMode: boolean;
  session: Session | null;
  initLoaded: boolean;
  isIos: boolean;
};
