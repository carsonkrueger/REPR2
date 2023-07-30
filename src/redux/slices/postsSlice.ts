import {
  EntityId,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Post, PostsState } from "../../types/postTypes";
import { RootState } from "../store";
import { supabase } from "../../types/supabaseClient";
import {
  followingTableRow,
  likesTableRow,
  postsTableRow,
  profilesTableRow,
} from "../../types/remoteDBTables";
import { getCurFullDate } from "../../util/dates";

// const initialPostsState: PostsState = { nextPostEntityId: 0, lastPostDate: "" };

// const postsStateSlice = createSlice({
//   name: "postsState",
//   initialState: initialPostsState,
//   reducers: {},
//   extraReducers(builder) {
//     builder.addCase(postsSlice.actions.addPost, (state) => {
//       state.nextPostEntityId += 1;
//     });
//   },
// });

export const getNextPost = createAsyncThunk(
  "getNextPost",
  async (payload: {
    lastPostCreatedAt: string;
  }): Promise<
    (postsTableRow & { profiles: Partial<profilesTableRow> }) | null
  > => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `post_id, created_at, image_url, user_id, num_likes, description, profiles ( user_id, user_name )`
      )
      .order("created_at", { ascending: false })
      .lt("created_at", payload.lastPostCreatedAt)
      .limit(1)
      .single();
    if (error?.code === "PGRST116") return null;
    if (error) console.warn(error);
    return data as postsTableRow & { profiles: Partial<profilesTableRow> };
  }
);

export const getDidLikePost = createAsyncThunk(
  "getDidLikePost",
  async (payload: { post: Post; userId: string }) => {
    const { data, error } = await supabase
      .from("likes")
      .select("post_id, user_id")
      .eq("user_id", payload.userId)
      .eq("post_id", payload.post.postId)
      .maybeSingle();
    if (error) console.warn(error);
    if (data) return true;
    else return false;
  }
);

export const toggleLikePost = createAsyncThunk(
  "toggleLikePost",
  async (payload: { userId: string; post: Post }) => {
    if (!payload.post.isLiked) {
      const { error } = await supabase.from("likes").upsert({
        post_id: payload.post.postId,
        user_id: payload.userId,
      });
      if (error) console.warn(error);
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", payload.userId)
        .eq("post_id", payload.post.postId);
      if (error) console.warn(error);
    }
  }
);

export const getIsFollowing = createAsyncThunk(
  "getIsFollowing",
  async (payload: { userId: string; post: Post }) => {
    console.log("getting following");
    const { data, error } = await supabase
      .from("following")
      .select("*")
      .eq("user_id", payload.userId)
      .eq("followed_user_id", payload.post.userId)
      .maybeSingle();
    if (error) console.warn(error);
    if (data) return true;
    else return false;
  }
);

export const toggleIsFollowing = createAsyncThunk(
  "getIsFollowing",
  async (payload: { userId: string; post: Post }) => {
    console.log("toggling is following");
    if (payload.post.isFollowing) {
      const { error } = await supabase
        .from("following")
        .delete()
        .eq("user_id", payload.userId)
        .eq("followed_user_id", payload.post.userId);
      if (error) console.warn(error);
    } else {
      const { error } = await supabase.from("following").upsert({
        user_id: payload.userId,
        followed_user_id: payload.post.userId,
      } as Partial<followingTableRow>);
      if (error) console.warn(error);
    }
  }
);

const postsAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.id,
});

const postsSlice = createSlice({
  name: "postsSlice",
  initialState: postsAdapter.getInitialState(),
  reducers: {
    addPost(state, action: PayloadAction<{ post: Post }>) {
      postsAdapter.addOne(state, action.payload.post);
    },
    clearAllPosts(state) {
      postsAdapter.removeAll(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNextPost.fulfilled, (state, result) => {
        if (!result.payload) return;
        const nextPostEntityId = state.ids.length;
        postsAdapter.addOne(state, {
          id: nextPostEntityId,
          isLiked: false,
          uri: "",
          createdAt: result.payload.created_at,
          numLikes: result.payload.num_likes,
          userId: result.payload.user_id,
          postId: result.payload.post_id,
          userName: result.payload.profiles.user_name!,
          isFollowing: false,
          description: result.payload.description,
        });
      })
      .addCase(toggleLikePost.pending, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.meta.arg.post.id,
          changes: { isLiked: !action.meta.arg.post.isLiked },
        });
      })
      .addCase(getDidLikePost.fulfilled, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.meta.arg.post.id,
          changes: { isLiked: action.payload },
        });
      })
      .addCase(getIsFollowing.fulfilled, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.meta.arg.post.id,
          changes: { isFollowing: action.payload },
        });
      })
      .addCase(toggleIsFollowing.pending, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.meta.arg.post.id,
          changes: { isFollowing: !action.meta.arg.post.isFollowing },
        });
      });
  },
});

// export const postsStateReducer = postsStateSlice.reducer;
// export const selectPostsState = (state: RootState) => state.postsState;

// export const selectNextPostId = createSelector(
//   [selectPostsState],
//   (postsState) => postsState.nextPostEntityId
// );

export const { addPost, clearAllPosts } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;

export const selectAllPosts = (state: RootState) => state.posts;
export const selectAllPostsIds = createSelector(
  [selectAllPosts],
  (posts) => posts.ids
);
export const selectPostByEntityId = createSelector(
  [selectAllPosts, (_, postEntityId: EntityId) => postEntityId],
  (posts, postEntityId) => posts.entities[postEntityId]
);
