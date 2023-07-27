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
import postFromPostTableRow from "../../util/postsUtils";

const initialPostsState: PostsState = { nextPostEntityId: 0 };

const postsStateSlice = createSlice({
  name: "postsState",
  initialState: initialPostsState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(postsSlice.actions.addPost, (state) => {
      state.nextPostEntityId += 1;
    });
  },
});

export const getNextPost = createAsyncThunk(
  "getNextPost",
  async (payload: { lastPostCreateAt: string }): Promise<postsTableRow> => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .lt("created_at", payload.lastPostCreateAt)
      .single();
    console.log(data as postsTableRow);
    if (error) throw error;
    return data as postsTableRow;
  }
);

const initialPost: Post = {
  id: 0,
  postId: "",
  createAt: "",
  uri: "",
  userId: "",
  userName: "",
  numLikes: 0,
  isLiked: false,
};

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
  },
  extraReducers(builder) {
    builder
      .addCase(getNextPost.pending, (state) => {
        const nextPostEntityId = state.ids.length;
        const newPost: Post = { ...initialPost, id: nextPostEntityId };
        postsAdapter.addOne(state, newPost);
      })
      .addCase(getNextPost.fulfilled, (state, result) => {
        if (!result.payload) return;
        const lastPostEntityId = state.ids.length - 1;
        postsAdapter.updateOne(state, {
          id: lastPostEntityId,
          changes: {
            createAt: result.payload.created_at,
            numLikes: result.payload.num_likes,
            userId: result.payload.user_id,
            postId: result.payload.post_id,
            userName: "giga",
          },
        });
      });
  },
});

export const postsStateReducer = postsStateSlice.reducer;
export const selectPostsState = (state: RootState) => state.postsState;

export const selectNextPostId = createSelector(
  [selectPostsState],
  (postsState) => postsState.nextPostEntityId
);

export const { addPost } = postsSlice.actions;
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
