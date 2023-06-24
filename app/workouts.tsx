import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import tw from "../src/util/tailwind";

import WorkoutTemplateComponent from "../src/components/workoutComponents/WorkoutTemplateComponent";
import { WorkoutTemplate } from "../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutTemplateHeaderComponent from "../src/components/workoutComponents/WorkoutTemplateHeaderComponent";

export default function Workouts() {
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <SafeAreaView>
        <View style={tw`py-1 bg-white shadow-md z-10`}>
          <Text style={tw`text-xl text-center`}>Workouts</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={templates}
        ListHeaderComponent={WorkoutTemplateHeaderComponent}
        renderItem={({ index }) => (
          <WorkoutTemplateComponent key={index} index={index} />
        )}
        style={tw`flex-1 flex-col`}
      />
    </>
  );
}
