import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
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
    <View style={tw`flex-row px-2 pt-6 justify-between items-center`}>
      <Text style={[tw`text-light-gray`, { fontFamily: "RobotoCondensed" }]}>
        My Workouts
      </Text>
      <TouchableOpacity
        // style={tw`shadow-sm justify-center items-center h-8 w-8 bg-primary rounded-full`}
        onPress={onCreateWorkout}
      >
        <Ionicons name="add" color={CustomColors.primary} size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutTemplateHeaderComponent;
