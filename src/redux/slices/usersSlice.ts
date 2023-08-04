import {
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { User } from "../../types/userType";
import { supabase } from "../../types/supabaseClient";
import { getNextPost } from "./postsSlice";
import { RootState } from "../store";
import { userFromProfileTableRow } from "../../util/postsUtils";

export const getIsFollowing = createAsyncThunk(
  "getIsFollowing",
  async (payload: { userId: string; user: User }) => {
    const { data, error } = await supabase
      .from("following")
      .select("*")
      .eq("user_id", payload.userId)
      .eq("followed_user_id", payload.user.userId)
      .maybeSingle();
    if (error) console.warn(error);
    if (data) return true;
    else return false;
  }
);

export const toggleIsFollowing = createAsyncThunk(
  "toggleIsFollowing",
  async (payload: { userId: string; user: User }) => {
    if (payload.user.isFollowing) {
      const { error } = await supabase
        .from("following")
        .delete()
        .eq("user_id", payload.userId)
        .eq("followed_user_id", payload.user.userId);
      if (error) console.warn(error);
    } else {
      const { error } = await supabase.from("following").upsert({
        followed_user_id: payload.user.userId,
        user_id: payload.userId,
      });
      if (error) console.warn(error);
    }
  }
);

const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.userId,
});

const usersSlice = createSlice({
  name: "usersSlice",
  initialState: usersAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getNextPost.fulfilled, (state, action) => {
        if (!action.payload) return;
        if (state.entities[(action.payload?.profiles as ProfileRow).user_id])
          return; // if user already exists, return
        usersAdapter.addOne(
          state,
          userFromProfileTableRow(action.payload?.profiles as ProfileRow)
        );
      })
      .addCase(getIsFollowing.fulfilled, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.meta.arg.user.userId,
          changes: { isFollowing: action.payload },
        });
      })
      .addCase(toggleIsFollowing.pending, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.meta.arg.user.userId,
          changes: { isFollowing: !action.meta.arg.user.isFollowing },
        });
      });
  },
});

export const usersReducer = usersSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users;
export const selectUserByUserId = createSelector(
  [selectAllUsers, (_, userId: string) => userId],
  (users, userId) => users.entities[userId]
);
