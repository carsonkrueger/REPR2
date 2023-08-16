import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectPostById } from "../../redux/slices/postsSlice";

interface props {
  postId: string;
}

export default function postTemplate({ postId }: props) {
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  return (
    <View>
      <Text>{post?.sharedWorkoutId}</Text>
    </View>
  );
}
