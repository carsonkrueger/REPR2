import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import {
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import tw from "../../src/util/tailwind";
import { FlashList } from "@shopify/flash-list";

import WorkoutTemplateComponent from "../../src/components/workoutComponents/WorkoutTemplateComponent";
import { WorkoutTemplate } from "../../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutTemplateHeaderComponent from "../../src/components/workoutComponents/WorkoutTemplateHeaderComponent";
import { useEffect, useState } from "react";
import {
  sqlDeleteAllWorkoutRows,
  sqlPrintExerciseHistory,
  sqlPrintWorkoutHistoryByDateDESC,
  sqlSelectAllTemplatesByDateDESC,
} from "../../src/sqlite/queries";
import { parsedWorkoutsTableRow } from "../../src/types/localDBTables";
import { addWorkoutTemplateToBack } from "../../src/redux/slices/WorkoutTemplatesSlice";
import { templateFromParseWorkoutTableRow } from "../../src/util/workoutUtils";

export default function Workouts() {
  const templates: WorkoutTemplate[] = useSelector(
    (state: RootState) => state.workoutTemplates
  );
  const dispatch: AppDispatch = useDispatch();

  const [distanceFromTop, setDistanceFromTop] = useState(0);

  useEffect(() => {
    // sqlPrintWorkoutHistoryByDateDESC();
    // sqlPrintExerciseHistory();
    // only get templates from sqlite db on first render (when temlates slice is empty)
    if (templates.length <= 0)
      sqlSelectAllTemplatesByDateDESC()
        .then((templates: parsedWorkoutsTableRow[]) => {
          for (let i = 0; i < templates.length; i++) {
            const template = templateFromParseWorkoutTableRow(templates[i]);
            dispatch(addWorkoutTemplateToBack(template));
          }
        })
        .catch((reason) => {
          console.log("ERR", reason);
        });
  }, []);

  function onSetDistanceFromTop(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    setDistanceFromTop(event.nativeEvent.contentOffset.y);
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front `}>
      <View
        style={tw`py-2 bg-front z-10 ${
          distanceFromTop <= 18 ? "" : "shadow-md"
        }`}
      >
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          WORKOUTS
        </Text>
      </View>

      <View style={tw`flex-1 px-2`}>
        {/* WORKOUT TEMPLATES */}
        <FlashList
          data={templates}
          ListHeaderComponent={WorkoutTemplateHeaderComponent}
          renderItem={({ item }) => (
            <WorkoutTemplateComponent
              key={"template" + item.workoutId}
              templateId={item.workoutId}
            />
          )}
          onScroll={onSetDistanceFromTop}
          estimatedItemSize={110}
          ListFooterComponent={<View style={tw`mb-52`} />}
        />
      </View>
    </SafeAreaView>
  );
}
