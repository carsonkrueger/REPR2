import Post from "../../src/components/postComponents/post";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../src/util/tailwind";
import useBackPress from "../../src/hooks/useBackPress";

export default function ViewPost() {
  useBackPress(true);
  const { postId } = useLocalSearchParams();

  return (
    <SafeAreaView style={tw`bg-front flex-1`}>
      <Post
        postId={postId as string}
        useCommentIcon={false}
        disabledTemplate={true}
        showOnlyFiveExercisesTemplate={false}
      />
      {/* <FlashList /> */}
    </SafeAreaView>
  );
}
