import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../src/redux/store";
import {
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import tw from "../../src/util/tailwind";
import { FlashList } from "@shopify/flash-list";

import WorkoutTemplateComponent from "../../src/components/workoutComponents/WorkoutTemplateComponent";
import { WorkoutTemplate } from "../../src/types/workoutTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import WorkoutTemplateHeaderComponent from "../../src/components/workoutComponents/WorkoutTemplateHeaderComponent";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  sqlDeleteWorkoutTemplateById,
  sqlInsertCurrentWorkoutTemplate,
  sqlSelectAllTemplatesByDateDESC,
  sqlSelectUnparsedWorkoutInfoById,
  sqlSelectWorkoutInfoById,
} from "../../src/sqlite/queries";
import { parsedWorkoutsTableRow } from "../../src/types/localDBTables";
import {
  addWorkoutTemplateToBack,
  addWorkoutTemplateToFront,
  delWorkoutTemplateById,
  shareWorkoutTemplate,
} from "../../src/redux/slices/WorkoutTemplatesSlice";
import {
  templateFromCurrentWorkout,
  templateFromParseWorkoutTableRow,
} from "../../src/util/workoutUtils";
import PremiumIcon from "../../src/components/premiumIcon";
import SafeAlert from "../../src/components/MySafeAlert";
import { useRouter } from "expo-router";
import { selectAllTemplates } from "../../src/redux/slices/WorkoutTemplatesSlice";
import nonPremiumConstraints from "../../src/util/premiumConstraints";
import {
  selectProfile,
  setInitTemplatesLoadedTrue,
} from "../../src/redux/slices/profileSlice";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

export default function Workouts() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const templates: WorkoutTemplate[] = useSelector((state: RootState) =>
    selectAllTemplates(state)
  );

  const profile = useSelector((state: RootState) => selectProfile(state));
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [showMaxTemplatesAlert, setShowMaxTemplatesAlert] = useState(false);
  const [distanceFromTop, setDistanceFromTop] = useState(0);
  const [modalWorkoutId, setModalIndex] = useState<number | null>(null);

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

  const handleModalPress = useCallback((workoutId: number) => {
    if (modalWorkoutId === workoutId) bottomSheetRef.current?.close();
    else bottomSheetRef.current?.present();
    setModalIndex(workoutId);
  }, []);

  function onGetPremiumPress() {
    toggleMaxTemplateAlert();
    router.push("premium");
  }

  async function onDeleteWorkoutPress() {
    if (!modalWorkoutId) return;
    dispatch(delWorkoutTemplateById(modalWorkoutId));
    sqlDeleteWorkoutTemplateById(modalWorkoutId);
    setModalIndex(null);
    bottomSheetRef.current?.close();
  }

  async function onShareWorkoutPress() {
    if (!modalWorkoutId) return;
    const template = await sqlSelectUnparsedWorkoutInfoById(modalWorkoutId);
    // const template = await sqlSelectWorkoutInfoById(modalWorkoutId);
    dispatch(
      shareWorkoutTemplate({
        template: template,
        userId: profile.user.userId,
      })
    );
    bottomSheetRef.current?.close();
  }

  async function onDuplicateWorkoutPress() {
    if (!modalWorkoutId) return;

    const template = await sqlSelectWorkoutInfoById(modalWorkoutId);
    const insertId = await sqlInsertCurrentWorkoutTemplate(
      template.workout_state,
      template.exercises,
      template.sets
    );
    dispatch(
      addWorkoutTemplateToFront(
        templateFromCurrentWorkout(
          insertId,
          template.workout_state,
          template.exercises
        )
      )
    );

    bottomSheetRef.current?.close();
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
          safeCommand={onGetPremiumPress}
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
              tw`text-dark-gray px-5 pt-1 pb-2`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            Get premium to store unlimited templates and take your fitness to
            the next level
          </Text>
        </SafeAlert>
      )}

      <BottomSheetModalProvider>
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
                toggleModal={handleModalPress}
              />
            )}
            onScroll={onSetDistanceFromTop}
            estimatedItemSize={110}
            ListFooterComponent={<View style={tw`mb-52`} />}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <BottomSheetModal
          backgroundStyle={tw`bg-dark-back`}
          ref={bottomSheetRef}
          snapPoints={["45%"]}
          index={0}
          handleIndicatorStyle={tw`bg-white`}
        >
          <TouchableOpacity onPress={onShareWorkoutPress}>
            <Text
              style={[
                tw`w-[85%] mt-2 py-2 rounded-md shadow-md bg-dark-front self-center text-white text-center text-lg`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              Post Workout to Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDuplicateWorkoutPress}>
            <Text
              style={[
                tw`w-[85%] mt-4 py-2 rounded-md shadow-md bg-dark-front self-center text-white text-center text-lg`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              Duplicate Workout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteWorkoutPress}>
            <Text
              style={[
                tw`w-[85%] mt-4 py-2 rounded-md shadow-md bg-danger self-center text-white text-center text-lg`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              Delete Workout
            </Text>
          </TouchableOpacity>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </SafeAreaView>
  );
}
