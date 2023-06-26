import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from "../../util/tailwind";
import { useSelector, useDispatch } from "react-redux";

import { AppDispatch, RootState } from "../../redux/store";
import { addWorkoutTemplate } from "../../redux/slices/WorkoutTemplatesSlice";

const WorkoutTemplateHeaderComponent = () => {
  const templates = useSelector((state: RootState) => state.workoutTemplates);
  const dispatch: AppDispatch = useDispatch();

  return (
    <View style={tw`flex-row px-2 pt-6 justify-between items-center`}>
      <Text>My Workouts</Text>
      <TouchableOpacity
        style={tw`p-1`}
        onPress={() => dispatch(addWorkoutTemplate())}
      >
        <Ionicons name="add" color={"#60a5fa"} size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutTemplateHeaderComponent;
