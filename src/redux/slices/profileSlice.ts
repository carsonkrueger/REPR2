import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Platform } from "react-native";

import { Profile } from "../../types/profileType";
import { supabase } from "../../types/supabaseClient";
import { profilesTable } from "../../types/remoteDBTables";
import { Session } from "@supabase/supabase-js";
import { RootState } from "../store";

const initialSettings: Profile = {
  userId: "",
  email: "",
  username: "",
  firstname: "",
  lastname: "",
  isPremium: false,
  isDarkMode: false,
  session: null,
  initLoaded: false,
  isIos: true,
  num_posts: 0,
  num_followers: 0,
  num_following: 0,
};

export const getSession = createAsyncThunk(
  "getSession",
  async (): Promise<Session | null> => {
    const session = await supabase.auth.getSession();
    if (session.error) throw session.error;
    return session.data.session;
  }
);

export const getProfile = createAsyncThunk(
  "getProfile",
  async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "user_id, user_name, first_name, last_name, is_premium, num_posts, num_followers, num_following"
      )
      .eq("user_id", userId)
      .single();
    if (error) console.log("Error getting profile: ", error.message);
    return data as profilesTable;
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialSettings,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setSession(state, action: PayloadAction<{ session: Session }>) {
      state.session = action.payload.session;
      state.email = action.payload.session.user.email ?? "";
      state.userId = action.payload.session.user.id;
    },
    setInitLoadedTrue(state) {
      state.initLoaded = true;
    },
    getPlatform(state) {
      state.isIos = Platform.OS === "ios";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSession.fulfilled, (state, action) => {
        state.session = action.payload;
        if (action.payload) {
          state.session = action.payload;
          state.email = action.payload.user.email ?? "";
          state.userId = action.payload.user.id;
        }
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.firstname = action.payload.first_name;
          state.lastname = action.payload.last_name;
          state.username = action.payload.user_name;
          state.isPremium = action.payload.is_premium;
          state.num_posts = action.payload.num_posts;
          state.num_followers = action.payload.num_followers;
          state.num_following = action.payload.num_following;
        }
      });
  },
});

export const profileReducer = profileSlice.reducer;
export const { toggleDarkMode, setSession, setInitLoadedTrue, getPlatform } =
  profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile;
export const selectIsPremium = createSelector(
  selectProfile,
  (profile) => profile.isPremium
);
