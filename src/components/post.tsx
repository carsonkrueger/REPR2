import { useRef } from "react";
import { View, Image, Text } from "react-native";
import { Dimensions } from "react-native";
import tw from "../util/tailwind";
import { RootState } from "../redux/store";
import { selectPostByEntityId } from "../redux/slices/postsSlice";
import { useSelector } from "react-redux";
import { EntityId } from "@reduxjs/toolkit";

const postImageRatio = [1, 1];

interface props {
  postEntityId: EntityId;
}

export default function Post({ postEntityId }: props) {
  const windowWidth = useRef(Dimensions.get("window").width);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );
  const post = useSelector((state: RootState) =>
    selectPostByEntityId(state, postEntityId)
  );

  return (
    <View style={tw`w-full my-2`}>
      <Text>{post?.userName}</Text>
      <Image
        source={{ uri: post?.uri }}
        style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px`}
      />
    </View>
  );
}
