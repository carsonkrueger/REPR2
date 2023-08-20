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
    <>
      <View
        style={[
          tw`px-3 flex-row justify-between items-center`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        <Text style={tw`text-lg text-dark-gray`}>
          {post?.sharedTemplate?.workoutState.name}
        </Text>
        <Text
          style={[
            tw`text-light-gray text-center text-sm`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          Workout Template
        </Text>
      </View>
      <View style={tw`px-3 py-1 shadow-md bg-white`}>
        {/* <Text
          style={[
            tw`text-center text-lg text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {post?.sharedTemplate?.workoutState.name}
        </Text> */}

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
    </>
  );
}
