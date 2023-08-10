import Post from "../../src/components/postComponents/post";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../../src/util/tailwind";
import { useEffect } from "react";
import { BackHandler } from "react-native";

export default function ViewPost() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();

  useEffect(() => {
    const backAction = () => {
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={tw`bg-front flex-1`}>
      <Post postId={postId as string} useCommentIcon={false} />
      {/* <FlashList /> */}
    </SafeAreaView>
  );
}
