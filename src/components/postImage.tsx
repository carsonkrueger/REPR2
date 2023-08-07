import { useRef } from "react";
import {
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  View,
} from "react-native";
import { postImageRatio } from "../util/postImageRatio";
import tw from "../util/tailwind";

interface props {
  base64?: string;
  onDoublePress?: () => void;
}

export default function PostImage({ base64, onDoublePress }: props) {
  const windowWidth = useRef(Dimensions.get("window").width);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );

  // Missing uri
  if (!base64)
    return (
      <TouchableWithoutFeedback>
        <View
          style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px bg-transparent`}
        />
      </TouchableWithoutFeedback>
    );

  // Not missing uri
  return (
    <TouchableWithoutFeedback>
      <Image
        source={{ uri: base64 }}
        style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px`}
      />
    </TouchableWithoutFeedback>
  );
}
