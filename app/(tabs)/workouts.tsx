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
import { sqlSelectAllTemplatesByDateDESC } from "../../src/sqlite/queries";
import { parsedWorkoutsTableRow } from "../../src/types/localDBTables";
import { addWorkoutTemplateToBack } from "../../src/redux/slices/WorkoutTemplatesSlice";
import { templateFromParseWorkoutTableRow } from "../../src/util/workoutUtils";
import PremiumIcon from "../../src/components/premiumIcon";
import SafeAlert from "../../src/components/MySafeAlert";
import { useRouter } from "expo-router";
import { selectAllTemplates } from "../../src/redux/slices/WorkoutTemplatesSlice";
import nonPremiumConstraints from "../../src/util/premiumConstraints";
import { selectIsPremium } from "../../src/redux/slices/profileSlice";

export default function Workouts() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const templates: WorkoutTemplate[] = useSelector((state: RootState) =>
    selectAllTemplates(state)
  );
  const isPremium = useSelector((state: RootState) => selectIsPremium(state));

  const [showMaxTemplatesAlert, setShowMaxTemplatesAlert] = useState(false);
  const [distanceFromTop, setDistanceFromTop] = useState(0);

  useEffect(() => {
    // only get templates from sqlite db on first render (when temlates slice is empty)
    if (templates.length <= 0)
      sqlSelectAllTemplatesByDateDESC().then(
        (templates: parsedWorkoutsTableRow[]) => {
          templates.map((parsedTemplate) =>
            dispatch(
              addWorkoutTemplateToBack(
                templateFromParseWorkoutTableRow(parsedTemplate)
              )
            )
          );
        }
      );
  }, []);

  function onSetDistanceFromTop(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    setDistanceFromTop(event.nativeEvent.contentOffset.y);
  }

  function toggleMaxTemplateAlert() {
    setShowMaxTemplatesAlert((prev) => !prev);
  }

  function canCreateCreateWorkout() {
    if (!isPremium && templates.length >= nonPremiumConstraints.numTemplates) {
      toggleMaxTemplateAlert();
      return false;
    }
    return true;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front `}>
      {/* HEADER */}
      <View
        style={tw`flex-row px-3 py-2 justify-between bg-front z-10 ${
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
        <PremiumIcon />
      </View>

      {/* MAX NUM TEMPLATES ALERT */}
      {showMaxTemplatesAlert && (
        <SafeAlert
          safeText="Get Premium"
          safeCommand={() => router.push("premium")}
          onOutOfBoundsClick={toggleMaxTemplateAlert}
        >
          <View style={tw`flex-row`}>
            <Text
              style={[
                tw`text-gold text-lg pr-1`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              PREMIUM
            </Text>
            <PremiumIcon />
          </View>

          <Text
            style={[
              tw`text-dark-gray px-8 pt-1 pb-2`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Get premium to store more templates and take your fitness to the
            next level
          </Text>
        </SafeAlert>
      )}

      <View style={tw`flex-1 px-2`}>
        {/* WORKOUT TEMPLATES */}
        <FlashList
          data={templates}
          ListHeaderComponent={
            <WorkoutTemplateHeaderComponent
              canCreateWorkout={canCreateCreateWorkout}
            />
          }
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
