import { View, Text, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import { useRouter } from "expo-router";

interface props {
  canCreateWorkout: () => boolean;
}

const WorkoutTemplateHeaderComponent = ({ canCreateWorkout }: props) => {
  const router = useRouter();

  const onCreateWorkout = () => {
    if (canCreateWorkout())
      router.push({
        pathname: `workout/${-1}`,
        params: { paramWorkoutId: -1 },
      });
  };

  return (
    <View style={tw`px-2 pt-6`}>
      <Text
        style={[tw`text-primary text-lg`, { fontFamily: "RobotoCondensed" }]}
      >
        MY TEMPLATES
      </Text>
      <TouchableOpacity
        style={tw`bg-primary rounded-md py-1 mt-2 shadow-md`}
        onPress={onCreateWorkout}
      >
        <Text
          style={[
            tw`text-lg text-white text-center`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          CREATE NEW WORKOUT
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutTemplateHeaderComponent;
