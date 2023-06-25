import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import tw from "../src/util/tailwind";

import WorkoutTemplateComponent from "../src/components/workoutComponents/WorkoutTemplateComponent";
import { Workout, WorkoutTemplate } from "../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutTemplateHeaderComponent from "../src/components/workoutComponents/WorkoutTemplateHeaderComponent";

export default function Workouts() {
  const curWorkout: Workout = useSelector((state: RootState) => state.workout);
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <View style={tw`flex-1 bg-back dark:bg-dark-back`}>
      <SafeAreaView>
        <View style={tw`py-1 bg-front shadow-md z-10`}>
          <Text style={tw`text-xl text-center`}>Workouts</Text>
        </View>
      </SafeAreaView>

      {/* CURRENT WORKOUT */}
      {}

      {/* WORKOUT TEMPLATES */}
      <FlatList
        data={templates}
        ListHeaderComponent={WorkoutTemplateHeaderComponent}
        renderItem={({ index }) => (
          <WorkoutTemplateComponent key={index} index={index} />
        )}
        style={tw`flex-1 flex-col`}
      />
    </View>
  );
}
