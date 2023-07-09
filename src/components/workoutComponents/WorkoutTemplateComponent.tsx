import { useSelector, useDispatch } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import tw from "../../util/tailwind";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppDispatch, RootState } from "../../redux/store";
import { WorkoutTemplate } from "../../types/workoutTypes";
import { selectWorkoutInfoById } from "../../sqlite/queries";
import {
  setExercises,
  setSets,
  setWorkout,
} from "../../redux/slices/workoutSlice";
import { selectTemplateById } from "../../redux/slices/WorkoutTemplatesSlice";
import { parsedWorkoutsTableRow } from "../../types/localDBTables";

interface props {
  templateId: number;
}

export default function WorkoutTemplateComponent({ templateId }: props) {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const template: WorkoutTemplate = useSelector((state: RootState) =>
    selectTemplateById(state, templateId)
  );

  const onTemplatePress = () => {
    selectWorkoutInfoById(template.workoutId)
      .then((t: parsedWorkoutsTableRow) => {
        dispatch(setWorkout(t.workout_state));
        dispatch(setExercises(t.exercises));
        dispatch(setSets(t.sets));
        router.push({
          pathname: `workout/${t.workout_id}`,
          params: { paramWorkoutId: t.workout_id },
        });
      })
      .catch((reason) => console.log("error fetching workout", reason));
  };

  return (
    <View style={tw`mt-3 mx-1 max-h-32 min-h-24`}>
      {/* TRASH CONTAINER */}
      <View style={tw`absolute flex-1 right-0 h-full justify-center items-end`}>
        <TouchableOpacity
          style={tw`bg-red-500 h-full rounded-lg justify-center px-4`}
        >
          <Ionicons name="trash" color="white" size={30} />
        </TouchableOpacity>
      </View>

      {/* TEMPLATE CONTAINER */}
      <View style={tw`flex-1 bg-front p-2 shadow-sm rounded-lg`}>
        <TouchableOpacity
          style={tw`flex-row flex-1 `}
          onPress={onTemplatePress}
        >
          <View style={tw`flex-9 flex-col justify-evenly`}>
            <Text style={tw`text-lg text-primary`}>{template.workoutName}</Text>
            <Text style={tw`text-xs text-light-gray`}>
              Last Performed: {template.lastPerfromed}
            </Text>
          </View>

          <View style={tw`flex-10 flex-col justify-start`}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
