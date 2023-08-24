import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectPostById } from "../../redux/slices/postsSlice";
import tw from "../../util/tailwind";
import { useRouter } from "expo-router";
import { selectIsPremium } from "../../redux/slices/profileSlice";

interface props {
  postId: string;
  showOnlyFiveExercises?: boolean;
  disabled?: boolean;
}

export default function PostTemplate({
  postId,
  showOnlyFiveExercises = true,
  disabled = false,
}: props) {
  const router = useRouter();
  const post = useSelector((state: RootState) => selectPostById(state, postId));
  const isPremium = useSelector((state: RootState) => selectIsPremium(state));

  function onTemplatePress() {
    if (!isPremium) router.push("premium");
    else
      router.push({
        pathname: `post/${postId}`,
        params: { postId: postId },
      });
  }

  return (
    <>
      {/* Workout Name and header */}
      <View
        style={[
          tw`px-2 flex-row justify-between items-center`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        {/* Workout Name */}
        <View style={tw`flex-row`}>
          {/* Rounded corner (left) */}
          <View style={tw`w-1 bg-primary`}>
            <View style={tw`absolute rounded-br-md h-full w-full bg-front`} />
          </View>

          <Text
            style={tw`px-2 text-lg text-white bg-primary rounded-lg rounded-b-none`}
          >
            {post?.sharedTemplate?.workoutState.name}
          </Text>

          {/* Rounded corner (right) */}
          <View style={tw`w-1 bg-primary`}>
            <View style={tw`absolute rounded-bl-md h-full w-full bg-front`} />
          </View>
        </View>

        <Text
          style={[
            tw`text-light-gray text-center text-sm`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          Workout Template
        </Text>
      </View>

      {/* Template Exercises */}
      <TouchableOpacity
        style={tw`px-3 py-1 border-t-[1px] border-b-[1px] border-primary shadow-sm bg-white`}
        onPress={onTemplatePress}
        disabled={disabled}
      >
        {post?.sharedTemplate?.exercises.ids.map((id, idx) => {
          return idx < 4 || !showOnlyFiveExercises ? (
            <Text
              key={`postTemplate-${post.postId}-${idx}`}
              style={[
                tw`text-base text-dark-gray`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {post.sharedTemplate?.exercises.entities[id]?.name}
            </Text>
          ) : idx === 4 ? (
            <Text
              style={tw`text-base text-primary text-center`}
              key={`postTemplate-${post.postId}-${idx}`}
            >
              ...
            </Text>
          ) : null;
        })}
      </TouchableOpacity>
    </>
  );
}
