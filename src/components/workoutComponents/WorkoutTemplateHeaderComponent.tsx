import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from "../../util/tailwind";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";

import { AppDispatch, RootState } from "../../redux/store";
import { addWorkoutTemplate } from "../../redux/slices/WorkoutTemplatesSlice";
import CustomColors from "../../util/customColors";

const WorkoutTemplateHeaderComponent = () => {
  const router = useRouter();
  const templates = useSelector((state: RootState) => state.workoutTemplates);
  const dispatch: AppDispatch = useDispatch();

  const onAddWorkout = () => {
    router.push(`workout/${-1}`);
    dispatch(addWorkoutTemplate());
  };

  return (
    <View style={tw`flex-row px-2 pt-6 justify-between items-center`}>
      <Text style={[tw`text-light-gray`, { fontFamily: "RobotoCondensed" }]}>
        My Workouts
      </Text>
      <TouchableOpacity
        // style={tw`shadow-sm justify-center items-center h-8 w-8 bg-primary rounded-full`}
        onPress={onAddWorkout}
      >
        <Ionicons name="add" color={CustomColors.primary} size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutTemplateHeaderComponent;
