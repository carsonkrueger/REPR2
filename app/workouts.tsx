import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { FlatList, View } from "react-native";
import tw from "twrnc";

import WorkoutTemplateComponent from "../src/components/WorkoutTemplateComponent";
import { WorkoutTemplate } from "../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workouts() {
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <SafeAreaView></SafeAreaView>
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
