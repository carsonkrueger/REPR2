import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { FlatList, View, Text } from "react-native";
import tw from "../src/util/tailwind";
import { useRouter } from "expo-router";

import WorkoutTemplateComponent from "../src/components/workoutComponents/WorkoutTemplateComponent";
import { Workout, WorkoutTemplate } from "../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutTemplateHeaderComponent from "../src/components/workoutComponents/WorkoutTemplateHeaderComponent";
import { templateFromWorkout } from "../src/util/workoutUtils";

export default function Workouts() {
  const curWorkout: Workout = useSelector((state: RootState) => state.workout);
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  return (
    <View style={tw`flex-1 bg-back dark:bg-dark-back`}>
      <SafeAreaView style={tw`z-10`}>
        <View style={tw`py-2 bg-front shadow-md`}>
          <Text
            style={[tw`text-xl text-center`, { fontFamily: "RobotoCondensed" }]}
          >
            Workouts
          </Text>
        </View>
      </SafeAreaView>

      <View style={tw`flex-1 px-4`}>
        {/* WORKOUT TEMPLATES */}
        <FlatList
          data={templates}
          ListHeaderComponent={WorkoutTemplateHeaderComponent}
          renderItem={({ item, index }) => (
            <WorkoutTemplateComponent key={index} template={item} />
          )}
          style={tw`flex-1 flex-col`}
          ListFooterComponent={<View style={tw`mb-52`} />}
        />
      </View>
    </View>
  );
}
