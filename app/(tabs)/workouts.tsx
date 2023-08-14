import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import {
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  BackHandler,
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
import {
  selectProfile,
  setInitTemplatesLoadedTrue,
} from "../../src/redux/slices/profileSlice";
import BottomSheet from "@gorhom/bottom-sheet";

export default function Workouts() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const templates: WorkoutTemplate[] = useSelector((state: RootState) =>
    selectAllTemplates(state)
  );

  const profile = useSelector((state: RootState) => selectProfile(state));

  const [showMaxTemplatesAlert, setShowMaxTemplatesAlert] = useState(false);
  const [distanceFromTop, setDistanceFromTop] = useState(0);

  useEffect(() => {
    // only get templates from sqlite db on first render (when temlates slice is empty)
    // sqlDropAllTables();
    if (!profile.initTemplatesLoaded) {
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
      dispatch(setInitTemplatesLoadedTrue());
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
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
    if (
      !profile.user.isPremium &&
      templates.length >= nonPremiumConstraints.numTemplates
    ) {
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
          WORKOUT
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
          showsVerticalScrollIndicator={false}
        />
      </View>
      <BottomSheet snapPoints={["%100"]}>
        <Text>1</Text>
      </BottomSheet>
    </SafeAreaView>
  );
}
