import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectPostById } from "../../redux/slices/postsSlice";
import tw from "../../util/tailwind";

interface props {
  postId: string;
}

export default function PostTemplate({ postId }: props) {
  const post = useSelector((state: RootState) => selectPostById(state, postId));

  return (
    <View style={tw`flex-row justify-between mx-1 p-2 rounded-md bg-primary`}>
      <Text style={[tw`text-lg text-white`, { fontFamily: "RobotoCondensed" }]}>
        {post?.sharedTemplate?.workoutState.name}
      </Text>
      <View style={tw`flex-col items-center`}></View>
      {post?.sharedTemplate?.exercises.ids.map((id) => (
        <Text
          key={`postTemplate-${post.postId}-${post.sharedTemplate?.exercises.entities[id]?.id}`}
          style={[tw`text-sm text-white`, { fontFamily: "RobotoCondensed" }]}
        >
          {post.sharedTemplate?.exercises.entities[id]?.name}
        </Text>
      ))}
    </View>
  );
}
