import {
  EntityId,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Post } from "../../types/postTypes";
import { RootState } from "../store";
import { supabase } from "../../types/supabaseClient";
import { postFromPostTableRow } from "../../util/postsUtils";

export const getNextPost = createAsyncThunk(
  "getNextPost",
  async (payload: { lastPostCreatedAt: string }) => {
    // get post
    const { data, error } = await supabase
      .from("posts")
      .select(
        `post_id, created_at, image_id, user_id, shared_workout_id, num_likes, description, profiles (user_id, user_name, first_name, last_name, num_followers, num_following, num_posts, is_premium)`
      )
      .order("created_at", { ascending: false })
      .lt("created_at", payload.lastPostCreatedAt)
      .limit(1)
      .single();
    if (error?.code === "PGRST116") return undefined;
    if (error) console.warn(error);

    return data;
  }
);

export const getBase64Image = createAsyncThunk(
  "getBase64Image",
  async (post: Post) => {
    if (post.imageId) {
      const { data, error } = await supabase.storage
        .from("images")
        .download(`${post.userId}/${post.imageId}`);

      if (error) {
        console.error("Error downloading image:", error);
      } else if (data) {
        try {
          return new Promise<string>((resolve, reject) => {
            const fr = new FileReader();
            fr.readAsDataURL(data);
            fr.onload = function () {
              resolve(fr.result as string);
            };
            fr.onerror = function () {
              reject("error");
            };
          });
        } catch (error) {
          console.error("Error reading image:", error);
        }
      } else {
        console.error("No data or error returned");
      }
    }
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
  async (payload: { post: Post; userId: string }) => {
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

const postsAdapter = createEntityAdapter<Post>({
  selectId: (post) => post.postId,
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
        if (state.entities[result.payload.post_id]) return; // if post already exists, return
        postsAdapter.addOne(state, postFromPostTableRow(result.payload));
        // const image = await supabase.storage.from("images").download(`${result.payload.user_id}/${result.payload.image_id}`)
      })
      .addCase(toggleLikePost.pending, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.meta.arg.post.postId,
          changes: { isLiked: !action.meta.arg.post.isLiked },
        });
      })
      .addCase(getDidLikePost.fulfilled, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.meta.arg.post.postId,
          changes: { isLiked: action.payload },
        });
      })
      .addCase(getBase64Image.fulfilled, (state, action) => {
        if (!action.payload) return;
        postsAdapter.updateOne(state, {
          id: action.meta.arg.postId,
          changes: { base64Image: action.payload },
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
export const selectPostById = createSelector(
  [selectAllPosts, (_, postId: EntityId) => postId],
  (posts, postId) => posts.entities[postId]
);
