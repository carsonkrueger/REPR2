import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import tw from "../../util/tailwind";
import { useRouter } from "expo-router";

import CustomColors from "../../util/customColors";

const WorkoutTemplateHeaderComponent = () => {
  const router = useRouter();

  const onCreateWorkout = () => {
    router.push({ pathname: `workout/${-1}`, params: { paramWorkoutId: -1 } });
    // dispatch(addWorkoutTemplate());
  };

  return (
    <View style={tw`flex-row px-3 pt-6 justify-between items-center`}>
      <Text
        style={[tw`text-primary text-lg`, { fontFamily: "RobotoCondensed" }]}
      >
        MY TEMPLATES
      </Text>
      <TouchableOpacity style={tw`p-1`} onPress={onCreateWorkout}>
        <Feather name="plus" size={28} color={CustomColors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutTemplateHeaderComponent;
