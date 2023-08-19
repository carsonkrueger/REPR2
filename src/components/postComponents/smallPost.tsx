import { useEffect } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { getBase64Image, selectPostById } from "../../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PostImage from "./postImage";
import { EntityId } from "@reduxjs/toolkit";
import { useRouter } from "expo-router";

interface props {
  postId: EntityId;
}

export default function SmallPost({ postId }: props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const post = useSelector((state: RootState) =>
    selectPostById(state, postId)
  )!;

  useEffect(() => {
    // get image for post if image_id exists and base64Image does not exist
    if (post.contentType === 1 && !post.base64Image)
      dispatch(getBase64Image(post));
  }, []);

  function navigateToViewPost() {
    router.push({
      pathname: `post/${post.postId}`,
      params: { postId: post.postId },
    });
  }

  if (post.contentType !== 1) return null;

  return (
    <PostImage
      base64={post.base64Image}
      imageScale={0.33}
      onPress={navigateToViewPost}
    />
  );
}
