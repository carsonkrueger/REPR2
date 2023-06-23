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
      style={tw`flex-row mx-4 my-4 shadow-md rounded-2xl bg-white max-h-32 min-h-24 p-2`}
      onPress={navigateTo}
    >
      <View style={tw`flex-9 flex-col justify-evenly`}>
        <Text style={tw`text-lg`}>{template.workoutName}</Text>
        <Text style={tw`text-xs`}>
          Last Performed: {template.lastPerfromed}
        </Text>
      </View>

      <View style={tw`flex-10 flex-col justify-start`}></View>
    </TouchableOpacity>
  );
}
