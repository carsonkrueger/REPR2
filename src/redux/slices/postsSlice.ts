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
import { postsTableRow } from "../../types/remoteDBTables";

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
  async (payload: { lastPostCreatedAt: string }): Promise<postsTableRow> => {
    const { data, error } = await supabase
      .from("posts")
      .select("post_id, created_at, image_url, user_id, num_likes")
      .order("created_at", { ascending: false })
      .lt("created_at", payload.lastPostCreatedAt)
      .limit(1)
      .single();
    if (error) console.log(error);
    return data as postsTableRow;
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
    toggleLikePost(state, action: PayloadAction<{ postId: EntityId }>) {
      const isLiked = state.entities[action.payload.postId]?.isLiked;
      postsAdapter.updateOne(state, {
        id: action.payload.postId,
        changes: { isLiked: !isLiked },
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(getNextPost.fulfilled, (state, result) => {
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
        userName: "Username",
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

export const { addPost, clearAllPosts, toggleLikePost } = postsSlice.actions;
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
