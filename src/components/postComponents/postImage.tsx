import { useRef } from "react";
import {
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { postImageRatio } from "../../util/postImageRatio";
import tw from "../../util/tailwind";

interface props {
  base64?: string;
  onDoublePress?: () => void;
  onPress?: () => void;
  imageScale?: number;
  style?: StyleProp<ViewStyle>;
}

export default function PostImage({
  base64,
  onDoublePress,
  onPress,
  imageScale = 1,
  style,
}: props) {
  const windowWidth = useRef(Dimensions.get("window").width * imageScale);
  const postImageHeight = useRef(
    windowWidth.current * (postImageRatio[0] / postImageRatio[1])
  );

  function handlePress() {
    if (onPress) onPress();
  }

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
    <TouchableWithoutFeedback style={style} onPress={handlePress}>
      <Image
        source={{ uri: base64 }}
        style={tw`w-${windowWidth.current}px h-${postImageHeight.current}px`}
      />
    </TouchableWithoutFeedback>
  );
}
