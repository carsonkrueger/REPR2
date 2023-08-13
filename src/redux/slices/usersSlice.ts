import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { User } from "../../types/userType";
import { supabase } from "../../types/supabaseClient";
import { getNextPost, getNextUserPosts } from "./postsSlice";
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
    if (error) throw error;
    if (data) return true;
    else return false;
  }
);

export const getUserStats = createAsyncThunk(
  "getUserStats",
  async (payload: { userId: string }) => {
    const numFollowing = await supabase
      .from("following")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", payload.userId);
    if (numFollowing.error) console.error(numFollowing.error);
    const numFollowers = await supabase
      .from("following")
      .select("followed_user_id", { count: "exact", head: true })
      .eq("followed_user_id", payload.userId);
    if (numFollowing.error) console.error(numFollowing.error);
    const numPosts = await supabase
      .from("posts")
      .select("user_id", { count: "exact", head: true })
      .eq("user_id", payload.userId);
    if (numPosts.error) console.error(numPosts.error);

    return {
      numFollowers: numFollowers.count,
      numFollowing: numFollowing.count,
      numPosts: numPosts.count,
    };
  }
);

export const toggleIsFollowing = createAsyncThunk(
  "toggleIsFollowing",
  async (payload: { userId: string; followedUser: User }) => {
    if (payload.followedUser.isFollowing) {
      const { error } = await supabase
        .from("following")
        .delete()
        .eq("user_id", payload.userId)
        .eq("followed_user_id", payload.followedUser.userId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("following").upsert({
        followed_user_id: payload.followedUser.userId,
        user_id: payload.userId,
      });
      if (error) throw error;
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
        // if user does not exist, add user
        if (!state.entities[(action.payload?.profiles)!.user_id]) {
          usersAdapter.addOne(
            state,
            userFromProfileTableRow(action.payload?.profiles!, [
              action.payload.post_id,
            ])
          );
        }
        // else user does exist and postId doesn't already exist, add postId to their postIds[]
        else if (
          !state.entities[action.payload.user_id]?.postIds.includes(
            action.payload.post_id
          )
        ) {
          const prevPostIds = state.entities[action.payload.user_id]!.postIds;
          usersAdapter.updateOne(state, {
            id: action.payload.user_id,
            changes: { postIds: [...prevPostIds, action.payload.post_id] },
          });
        }
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.meta.arg.userId,
          changes: {
            numFollowers: action.payload.numFollowers ?? 0,
            numFollowing: action.payload.numFollowing ?? 0,
            numPosts: action.payload.numPosts ?? 0,
          },
        });
      })
      .addCase(getIsFollowing.fulfilled, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.meta.arg.user.userId,
          changes: { isFollowing: action.payload },
        });
      })
      .addCase(toggleIsFollowing.pending, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.meta.arg.followedUser.userId,
          changes: { isFollowing: !action.meta.arg.followedUser.isFollowing },
        });
      })
      .addCase(getNextUserPosts.fulfilled, (state, action) => {
        if (!action.payload || action.payload.length === 0) return;

        const next10PostIds = action.payload.map((post) => post.post_id);

        // if userId does not exist, add user
        if (!state.entities[action.payload[0].user_id]) {
          usersAdapter.addOne(
            state,
            userFromProfileTableRow(action.payload[0].profiles!, next10PostIds)
          );
        }
        // else userId does exist, update postIds[] on user
        else {
          const prevPostIds =
            state.entities[action.payload[0].user_id]!.postIds;
          usersAdapter.updateOne(state, {
            id: action.payload[0].user_id,
            changes: {
              postIds: [...new Set([...prevPostIds, ...next10PostIds])],
            },
          });
        }
      });
  },
});

export const usersReducer = usersSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users;
export const selectUserByUserId = createSelector(
  [selectAllUsers, (_, userId: string) => userId],
  (users, userId) => users.entities[userId]
);
