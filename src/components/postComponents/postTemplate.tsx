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
    <View style={tw`p-2 mx-2 border-[1px] border-primary rounded-md`}>
      <Text
        style={[
          tw`text-center text-lg text-primary`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        {post?.sharedTemplate?.workoutState.name}
      </Text>

      <View style={tw`flex-col`}>
        {post?.sharedTemplate?.exercises.ids.map((id, idx) => {
          return idx <= 5 ? (
            <Text
              key={`postTemplate-${post.postId}-${post.sharedTemplate?.exercises.entities[id]?.id}`}
              style={[
                tw`text-base text-primary`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {post.sharedTemplate?.exercises.entities[id]?.name}
            </Text>
          ) : null;
        })}
      </View>
    </View>
  );
}
