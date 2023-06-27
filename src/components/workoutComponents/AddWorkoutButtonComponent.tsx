import { TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addWorkoutTemplate } from "../../redux/slices/WorkoutTemplatesSlice";

const AddWorkoutButton = () => {
  const templates = useSelector((state: RootState) => state.workoutTemplates);
  const dispatch: AppDispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => dispatch(addWorkoutTemplate())}
      style={tw`flex-1 bg-primary text-white`}
    >
      ADD WORKOUT
    </TouchableOpacity>
  );
};
