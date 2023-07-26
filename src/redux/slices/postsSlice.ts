import {
  EntityId,
  PayloadAction,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Post, PostsState } from "../../types/postTypes";
import { RootState } from "../store";

const initialPostsState: PostsState = { nextPostEntityId: 0 };

const postsState = createSlice({
  name: "postsState",
  initialState: initialPostsState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(postsSlice.actions.addPost, (state) => {
      state.nextPostEntityId += 1;
    });
  },
});

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
});

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
