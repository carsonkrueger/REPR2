import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { FlatList, View, Text } from "react-native";
import tw from "../src/util/tailwind";

import WorkoutTemplateComponent from "../src/components/workoutComponents/WorkoutTemplateComponent";
import { WorkoutTemplate } from "../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workouts() {
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <SafeAreaView>
        <View style={tw`py-1 bg-white`}>
          <Text style={tw`text-xl text-center`}>Workouts</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={templates}
        renderItem={({ item, index }) => (
          <WorkoutTemplateComponent key={item.workoutId} index={index} />
        )}
        style={tw`flex-1 flex-col`}
      />
    </>
  );
}
