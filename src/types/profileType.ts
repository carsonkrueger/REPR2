import { Session } from "@supabase/supabase-js";

export type Profile = {
  userId: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  isDarkMode: boolean;
  isPremium: boolean;
  session: Session | null;
  initLoaded: boolean;
  isIos: boolean;
};
