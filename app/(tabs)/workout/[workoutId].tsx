import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  BackHandler,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import ExerciseComponent from "../../../src/components/workoutComponents/ExerciseComponent";
import { WorkoutState } from "../../../src/types/workoutTypes";
import { RootState, AppDispatch } from "../../../src/redux/store";
import {
  addExercise,
  cleanExercises,
  cleanSets,
  cleanWorkout,
  resetWorkout,
  selectExercises,
  selectSets,
  selectWorkout,
  setWorkoutId,
  setWorkoutName,
  startWorkout,
  toggleLock,
} from "../../../src/redux/slices/workoutSlice";
import MyAlert from "../../../src/components/MyDangerAlert";
import tw from "../../../src/util/tailwind";
import {
  sqlInsertCurrentWorkoutTemplate,
  sqlInsertExerciseHistory,
  sqlInsertWorkoutHistory,
  sqlUpdateWorkoutTemplate,
} from "../../../src/sqlite/queries";
import {
  addWorkoutTemplateToFront,
  updateWorkoutTemplate,
} from "../../../src/redux/slices/WorkoutTemplatesSlice";
import { templateFromCurrentWorkout } from "../../../src/util/workoutUtils";
import { EntityId } from "@reduxjs/toolkit";
import {
  addExerciseHistory,
  addWorkoutHistoryToFront,
} from "../../../src/redux/slices/metricsSlice";
import { ExerciseMetric, WorkoutMetric } from "../../../src/types/metricsTypes";
import NavigateBackButton from "../../../src/components/navigateBackButton";
import useBackPress from "../../../src/hooks/useBackPress";

export default function WorkoutScreen() {
  useBackPress(false, backPress);

  const { paramWorkoutId } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const workout: WorkoutState = useSelector((state: RootState) =>
    selectWorkout(state)
  );
  const exercises = useSelector((state: RootState) => selectExercises(state));
  const sets = useSelector((state: RootState) => selectSets(state));

  const [backPressed, setBackPressed] = useState(false);
  const [finishPressed, setFinishedPressed] = useState(false);
  const [distanceFromTop, setDistanceFromTop] = useState(0);

  useEffect(() => {
    if (!workout.inProgress) {
      dispatch(setWorkoutId({ id: Number(paramWorkoutId) }));
      dispatch(startWorkout());
    }
  }, []);

  useEffect(() => {
    if (finishPressed) {
      async function asyncFinish() {
        // insert new workout template
        if (Number(paramWorkoutId) === -1) {
          sqlInsertCurrentWorkoutTemplate(workout, exercises, sets).then(
            (insertId) =>
              dispatch(
                addWorkoutTemplateToFront(
                  templateFromCurrentWorkout(insertId, workout, exercises)
                )
              )
          );
        }
        // update old workout template
        else if (Number(paramWorkoutId) > 0) {
          sqlUpdateWorkoutTemplate(
            Number(paramWorkoutId),
            workout,
            exercises,
            sets
          );
          dispatch(
            updateWorkoutTemplate(
              templateFromCurrentWorkout(
                Number(paramWorkoutId),
                workout,
                exercises
              )
            )
          );
        }
      }
      asyncFinish();

      dispatch(resetWorkout());

      router.replace("/workouts");
    }
  }, [finishPressed]);

  function backPress() {
    setBackPressed((prev) => !prev);
  }

  function onFinishWorkout() {
    // insert workout history
    insertHistory();

    dispatch(cleanExercises());
    dispatch(cleanSets());
    dispatch(cleanWorkout());

    setFinishedPressed(true);
  }

  function cancelWorkout() {
    dispatch(resetWorkout());
    router.replace("/workouts");
  }

  function insertHistory() {
    sqlInsertWorkoutHistory(workout).then((workoutMetric: WorkoutMetric) => {
      dispatch(addWorkoutHistoryToFront({ workout: workoutMetric }));
      // insert workout history, then insert every exercise histroy
      for (let i = 0; i < exercises.ids.length; i++) {
        const exerciseId = exercises.ids[i];
        const { weight, reps } = calcBestSet(exerciseId);

        sqlInsertExerciseHistory(
          exercises.entities[exerciseId]!,
          Number(workoutMetric.workoutHistoryId),
          weight,
          reps,
          calcExerciseTotalVolume(exerciseId)
        ).then((exerciseMetric: ExerciseMetric) => {
          dispatch(
            addExerciseHistory({
              exercise: exerciseMetric,
            })
          );
        });
      }
    });
  }

  function calcBestSet(exerciseId: EntityId): { weight: number; reps: number } {
    let bestWeight = 0;
    let bestReps = 0;

    for (
      let i = 0;
      i < (exercises.entities[exerciseId]?.Sets.length ?? 0);
      i++
    ) {
      const setId: EntityId = exercises.entities[exerciseId]?.Sets[i] ?? 0;
      const newWeight = sets.entities[setId]?.weight ?? 0;
      const newReps = sets.entities[setId]?.reps ?? 0;
      if (newWeight * newReps > bestWeight * bestReps) {
        bestWeight = newWeight;
        bestReps = newReps;
      }
    }

    return { weight: bestWeight, reps: bestReps };
  }

  function calcExerciseTotalVolume(exerciseId: EntityId): number {
    let totalVolume = 0;
    exercises.entities[exerciseId]?.Sets.map(
      (setId) =>
        (totalVolume +=
          sets.entities[setId]!.weight * sets.entities[setId]!.reps)
    );
    return totalVolume;
  }

  function onSetDistanceFromTop(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    setDistanceFromTop(event.nativeEvent.contentOffset.y);
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front z-0`}>
      {/* BACK ALERT */}
      {backPressed && (
        <MyAlert
          msg="Are you sure you want to cancel your workout?"
          onOutOfBoundsClick={backPress}
          dangerCommand={cancelWorkout}
          safeCommand={backPress}
          dangerText="Cancel Workout"
          safeText="Continue"
        />
      )}

      {/* HEADER */}
      <View
        style={tw`flex-row justify-center items-center px-2 py-3 bg-front z-10 ${
          distanceFromTop <= 18 ? "" : "shadow-md"
        }`}
      >
        <NavigateBackButton onBackPress={backPress} />

        <TextInput
          style={[
            tw`flex-1 px-2 py-1 mx-1 text-xl rounded-md text-primary ${
              workout.isLocked ? "" : "bg-back"
            } `,
            { fontFamily: "RobotoCondensed" },
          ]}
          placeholder="Workout Name"
          placeholderTextColor={"#c2c2c2"}
          onChangeText={(text) => dispatch(setWorkoutName({ name: text }))}
          editable={!workout.isLocked}
        >
          {workout.name}
        </TextInput>

        <TouchableOpacity onPress={() => dispatch(toggleLock())}>
          <Entypo
            name={`${workout.isLocked ? "lock" : "lock-open"}`}
            color={"#3b83f5"}
            size={30}
          />
        </TouchableOpacity>
      </View>

      {/* EXERCISE COMPONENTS */}
      <FlashList
        data={exercises.ids}
        renderItem={({ item }) => (
          <ExerciseComponent key={"exercise" + item} exerciseId={item} />
        )}
        estimatedItemSize={220}
        onScroll={onSetDistanceFromTop}
        ListFooterComponent={
          // ADD EXERCISE BUTTON
          <View style={tw`mt-4 mb-[50%] items-center`}>
            {!workout.isLocked && (
              <TouchableOpacity
                style={tw`rounded-full bg-primary shadow-md`}
                onPress={() =>
                  dispatch(
                    addExercise({
                      nextExerciseId: workout.nextExerciseId,
                      nextSetId: workout.nextSetId,
                    })
                  )
                }
              >
                <Text style={tw`py-2 px-4 self-center text-center text-white`}>
                  ADD EXERCISE
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={tw` rounded-md px-3 py-1`}
              onPress={onFinishWorkout}
            >
              <Text
                style={[
                  tw`text-lg text-primary pt-3`,
                  { fontFamily: "RobotoCondensed" },
                ]}
              >
                FINISH WORKOUT
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}
