import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import { View, Text } from "react-native";
import tw from "../../src/util/tailwind";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import WorkoutTemplateComponent from "../../src/components/workoutComponents/WorkoutTemplateComponent";
import { WorkoutState, WorkoutTemplate } from "../../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutTemplateHeaderComponent from "../../src/components/workoutComponents/WorkoutTemplateHeaderComponent";
import { useEffect } from "react";
import { selectAllTemplatesByDateDESC } from "../../src/sqlite/queries";

export default function Workouts() {
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const allTemplates = selectAllTemplatesByDateDESC();

    console.log(allTemplates?.rows._array);
  });

  return (
    <View style={tw`flex-1 bg-back dark:bg-dark-back`}>
      <SafeAreaView style={tw`z-10`}>
        <View style={tw`py-2 bg-front shadow-sm`}>
          <Text
            style={[
              tw`text-xl text-center text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            WORKOUTS
          </Text>
        </View>
      </SafeAreaView>

      <View style={tw`flex-1 px-2`}>
        {/* WORKOUT TEMPLATES */}
        <FlashList
          data={templates}
          ListHeaderComponent={WorkoutTemplateHeaderComponent}
          renderItem={({ item, index }) => (
            <WorkoutTemplateComponent key={index} template={item} />
          )}
          estimatedItemSize={110}
          ListFooterComponent={<View style={tw`mb-52`} />}
        />
      </View>
    </View>
  );
}
