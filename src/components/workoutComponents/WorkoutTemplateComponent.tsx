import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import tw from "../../util/tailwind";

import { AppDispatch, RootState } from "../../redux/store";

interface props {
  index: number;
}

export default function WorkoutTemplateComponent({ index }: props) {
  const router = useRouter();
  const template = useSelector(
    (state: RootState) => state.workoutTemplates[index]
  );
  const dispatch: AppDispatch = useDispatch();

  const navigateTo = () => {
    router.push(`(workout)/${template.workoutId}`);
  };

  return (
    <TouchableOpacity
      style={tw`flex-1 mx-4 my-4 shadow-md rounded-2xl bg-white max-h-28 min-h-20 p-2`}
      onPress={navigateTo}
    >
      <View>
        <Text style={tw`text-lg`}>{template.workoutName}</Text>
        <Text style={tw`text-xs`}>
          Last Performed: {template.lastPerfromed}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
