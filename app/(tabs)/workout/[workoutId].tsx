import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

import ExerciseComponent from "../../../src/components/workoutComponents/ExerciseComponent";
import { Exercise, WorkoutState } from "../../../src/types/workoutTypes";
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

export default function WorkoutScreen() {
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

  useEffect(() => {
    if (!workout.inProgress) {
      dispatch(setWorkoutId({ id: Number(paramWorkoutId) }));
      dispatch(startWorkout());
    }

    const backAction = () => {
      backPress();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
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

      router.back();
      router.replace("/workouts");
    }
  }, [finishPressed]);

  function backPress() {
    setBackPressed((prev) => !prev);
  }

  function onFinishWorkout() {
    // insert workout history
    sqlInsertWorkoutHistory(workout).then((workoutHistoryId: number) => {
      // after insert workout history, insert every exercise histroy
      for (let i = 0; i < exercises.ids.length; i++) {
        const exerciseId = exercises.ids[i];
        const { weight, reps } = calcBestSet(exerciseId);
        sqlInsertExerciseHistory(
          exercises.entities[exerciseId]!,
          workoutHistoryId,
          weight,
          reps
        );
      }
    });

    dispatch(cleanExercises());
    dispatch(cleanSets());
    dispatch(cleanWorkout());

    setFinishedPressed(true);
  }

  function cancelWorkout() {
    dispatch(resetWorkout());
    router.back();
    router.replace("/workouts");
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

  return (
    <SafeAreaView style={[tw`flex-1 bg-back z-0`, { elevation: 0 }]}>
      {/* BACK ALERT */}
      {backPressed && (
        <MyAlert
          msg="Are you sure you want to finish your workout?"
          onOutOfBoundsClick={backPress}
          dangerCommand={cancelWorkout}
          safeCommand={onFinishWorkout}
          dangerText="Cancel Workout"
          safeText="Finish Workout"
        />
      )}

      {/* HEADER */}
      <View
        style={tw`flex-row justify-center items-center px-2 py-3 bg-front shadow-sm z-10`}
      >
        <TouchableOpacity onPress={backPress}>
          <Ionicons name="md-chevron-back" color={"#3b83f5"} size={30} />
        </TouchableOpacity>

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
        // removeClippedSubviews={false}
        // CellRendererComponent={({ children }) => children}
        renderItem={({ item }) => (
          <ExerciseComponent key={"exercise" + item} exerciseId={item} />
        )}
        estimatedItemSize={220}
        ListFooterComponent={
          // ADD EXERCISE BUTTON
          <View style={tw`mt-4 mb-[70%] items-center`}>
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
          </View>
        }
      />
    </SafeAreaView>
  );
}
