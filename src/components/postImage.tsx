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
  uri: string;
  onDoublePress?: () => void;
}

export default function PostImage({ uri, onDoublePress }: props) {
  const windowWidth = useRef(Dimensions.get("window").width);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );

  // Missing uri
  if (uri === "" || !uri)
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
        source={{ uri: uri }}
        style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px`}
      />
    </TouchableWithoutFeedback>
  );
}
