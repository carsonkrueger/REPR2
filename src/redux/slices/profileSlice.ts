import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Platform } from "react-native";

import { ProfileSettings } from "../../types/profileSettingsType";
import { supabase } from "../../types/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { RootState } from "../store";
import { User } from "../../types/userType";

const initialUser: User = {
  userId: "",
  numPosts: 0,
  numFollowers: 0,
  numFollowing: 0,
  userName: "",
  firstName: "",
  lastName: "",
  isPremium: false,
  isFollowing: false,
  postIds: [],
};

const initialSettings: ProfileSettings = {
  email: "",
  isDarkMode: false,
  session: null,
  initLoaded: false,
  initTemplatesLoaded: false,
  isIos: true,
  user: initialUser,
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
      .select("user_id, user_name, first_name, last_name, is_premium")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    const num_followers = await supabase
      .from("following")
      .select("followed_user_id", { count: "exact", head: true })
      .eq("followed_user_id", userId);
    const num_following = await supabase
      .from("following")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", userId);
    const num_posts = await supabase
      .from("posts")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", userId);

    const profileRow: ProfileRow = {
      ...data,
      num_followers: num_followers.count ?? 0,
      num_following: num_following.count ?? 0,
      num_posts: num_posts.count ?? 0,
    };
    return profileRow;
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
      state.user.userId = action.payload.session.user.id;
    },
    setInitLoadedTrue(state) {
      state.initLoaded = true;
    },
    setInitTemplatesLoadedTrue(state) {
      state.initTemplatesLoaded = true;
    },
    getPlatform(state) {
      state.isIos = Platform.OS === "ios";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSession.fulfilled, (state, result) => {
        if (result.payload) {
          state.session = result.payload;
          state.email = result.payload.user.email ?? "";
          state.user.userId = result.payload.user.id;
        }
      })
      .addCase(getProfile.fulfilled, (state, result) => {
        if (result.payload) {
          state.user.firstName = result.payload.first_name;
          state.user.lastName = result.payload.last_name;
          state.user.userName = result.payload.user_name;
          state.user.isPremium = result.payload.is_premium;
          state.user.numPosts = result.payload.num_posts;
          state.user.numFollowers = result.payload.num_followers;
          state.user.numFollowing = result.payload.num_following;
        }
      });
  },
});

export const profileReducer = profileSlice.reducer;
export const {
  toggleDarkMode,
  setSession,
  setInitLoadedTrue,
  setInitTemplatesLoadedTrue,
  getPlatform,
} = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile;
export const selectIsPremium = createSelector(
  selectProfile,
  (profile) => profile.user.isPremium
);
export const selectUserId = createSelector(
  selectProfile,
  (profile) => profile.user.userId
);
