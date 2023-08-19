import {
  EntityId,
  EntityState,
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
import { Exercise, WorkoutSet, WorkoutState } from "../../types/workoutTypes";

export const getNextPost = createAsyncThunk(
  "getNextPost",
  async (payload: { lastPostCreatedAt: string }) => {
    // get post
    const { data, error } = await supabase
      .from("posts")
      .select(
        `post_id, created_at, user_id, content_id, content_type, description, profiles (user_id, user_name, first_name, last_name, num_followers, num_following, num_posts, is_premium)`
      )
      .order("created_at", { ascending: false })
      .lt("created_at", payload.lastPostCreatedAt)
      .limit(1)
      .single();
    if (error?.code === "PGRST116") return undefined;
    if (error) console.error(error);

    return data;
  }
);

export const getNumPostLikes = createAsyncThunk(
  "getNumPost",
  async (payload: { postId: string }) => {
    const { count, error } = await supabase
      .from("likes")
      .select("post_id", { count: "exact", head: true })
      .eq("post_id", payload.postId);
    if (error) console.error(error);

    return count;
  }
);

export const getBase64Image = createAsyncThunk(
  "getBase64Image",
  async (post: Post) => {
    if (post.contentType !== 1 || post.base64Image !== undefined) return;
    const { data, error } = await supabase.storage
      .from("images")
      .download(`${post.userId}/${post.contentId}`);

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
);

export const getSharedTemplate = createAsyncThunk(
  "getSharedTemplate",
  async (post: Post) => {
    if (!post.contentId) return;

    const { data, error } = await supabase
      .from("workout_templates")
      .select("*")
      .eq("template_id", post.contentId)
      .single();

    if (error) console.error(error);
    else if (!data) console.error("No data returned for shared template");

    return data;
  }
);

export const getNextUserPosts = createAsyncThunk(
  "getNext10UserPosts",
  async (payload: {
    userId: string;
    numPostsToGet: number;
    indexStart?: number;
  }) => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "post_id, created_at, user_id, content_id, content_type, description, profiles (user_id, user_name, first_name, last_name, num_followers, num_following, num_posts, is_premium)"
      )
      .eq("user_id", payload.userId)
      .order("created_at", { ascending: false })
      .range(
        payload.indexStart ?? 0,
        payload.indexStart ?? 0 + payload.numPostsToGet
      )
      .limit(payload.numPostsToGet);

    if (error) return undefined;

    return data;
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
        postsAdapter.addOne(
          state,
          postFromPostTableRow(result.payload as PostRow)
        );
        // const image = await supabase.storage.from("images").download(`${result.payload.user_id}/${result.payload.image_id}`)
      })
      .addCase(getNumPostLikes.fulfilled, (state, result) => {
        if (!result.payload) return;
        if (state.entities[result.meta.arg.postId])
          postsAdapter.updateOne(state, {
            id: result.meta.arg.postId,
            changes: { numLikes: result.payload },
          });
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
      })
      .addCase(getSharedTemplate.fulfilled, (state, action) => {
        if (!action.payload) return;

        try {
          postsAdapter.updateOne(state, {
            id: action.meta.arg.postId,
            changes: {
              sharedTemplate: {
                workoutState: action.payload
                  .workout_state as unknown as WorkoutState,
                exercises: action.payload
                  .exercises as unknown as EntityState<Exercise>,
                sets: action.payload.sets as unknown as EntityState<WorkoutSet>,
              },
            },
          });
        } catch (e) {
          console.error(
            "could not update template post with shared workout",
            e
          );
        }
      })
      .addCase(getNextUserPosts.fulfilled, (state, action) => {
        if (!action.payload || action.payload.length === 0) return;
        action.payload.map((post) => {
          if (!state.entities[post.post_id])
            postsAdapter.addOne(state, postFromPostTableRow(post));
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
