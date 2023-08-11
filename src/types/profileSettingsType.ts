import { Session } from "@supabase/supabase-js";
import { User } from "./userType";

export type ProfileSettings = {
  email: string;
  isDarkMode: boolean;
  session: Session | null;
  initLoaded: boolean;
  initTemplatesLoaded: boolean;
  isIos: boolean;
  user: User;
};
