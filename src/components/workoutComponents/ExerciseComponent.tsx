import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { EntityId } from "@reduxjs/toolkit";

import tw from "../../util/tailwind";
import { Exercise } from "../../types/workoutTypes";
import { AppDispatch, RootState } from "../../redux/store";
import WorkoutSetComponent from "./WorkoutSetComponet";
import flexWidths from "../../util/exerciseHeaderFlexWidths";
import {
  addSet,
  delExercise,
  delSet,
  selectExerciseById,
  selectIsLocked,
  setMenuId,
  selectWorkout,
  setExerciseName,
  swapExerciseWithAbove,
  swapExerciseWithBelow,
} from "../../redux/slices/workoutSlice";
import Clock from "./ClockComponent";
import CustomColors from "../../util/customColors";
import { Profile } from "../../types/profileType";
import { selectProfile } from "../../redux/slices/profileSlice";
import { useRouter } from "expo-router";

interface props {
  exerciseId: EntityId;
}

export default function ExerciseComponent({ exerciseId }: props) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const workout = useSelector((state: RootState) => selectWorkout(state));
  const isLocked: boolean = useSelector((state: RootState) =>
    selectIsLocked(state)
  );
  const exercise: Exercise = useSelector((state: RootState) =>
    selectExerciseById(state, exerciseId)
  );
  const profile: Profile = useSelector((state: RootState) =>
    selectProfile(state)
  );

  const toggleMenu = () => {
    dispatch(setMenuId({ exerciseId: exerciseId }));
  };

  function toggleOffMenu() {
    dispatch(setMenuId({ exerciseId: undefined }));
  }

  function swapExerciseUp() {
    dispatch(swapExerciseWithAbove({ id: exerciseId }));
  }

  function swapExerciseDown() {
    dispatch(swapExerciseWithBelow({ id: exerciseId }));
  }

  function deleteExercise() {
    dispatch(delExercise({ id: exerciseId }));
  }

  function addSetToEnd() {
    dispatch(addSet({ exerciseId: exerciseId, nextSetId: workout.nextSetId }));
  }

  function delSetFromEnd() {
    dispatch(
      delSet({
        exerciseId: exerciseId,
        setId: exercise.Sets[exercise.Sets.length - 1],
        numSets: exercise.Sets.length,
      })
    );
  }

  function pushNavigateToExerciseSearch() {
    router.push({
      pathname: "exerciseSearch",
      params: { exerciseId: exercise.id },
    });
  }

  return (
    <View style={tw`py-3 mt-4 bg-front`}>
      {/* HEADER */}
      <View style={tw`mx-3 mb-1 flex-row items-center`}>
        {/* EXERCISE NAME */}
        <TouchableOpacity
          style={tw`flex-1 px-1 py-[6px] mr-2 ${
            isLocked ? "" : "rounded-md bg-back"
          }`}
          onPress={pushNavigateToExerciseSearch}
          disabled={isLocked}
        >
          <TextInput
            style={[
              tw`text-lg text-primary px-1`,
              { fontFamily: "RobotoCondensed" },
            ]}
            placeholder="Exercise Name"
            placeholderTextColor={"#c2c2c2"}
            editable={false}
            value={exercise.name}
            multiline={true}
          />
        </TouchableOpacity>

        <Clock exerciseId={exerciseId} />

        {/* ELLIPSIS VERTICAL MENU TOGGLE BUTTON */}
        {!isLocked && (
          <TouchableOpacity onPress={toggleMenu} style={tw`px-[3px]`}>
            <Feather
              name="more-vertical"
              size={24}
              color={CustomColors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* SETS HEADER */}
      <View style={tw`px-2 my-1 flex-row justify-center items-center`}>
        <Text
          style={[
            tw`flex-${flexWidths.set} text-center text-xs text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          SET
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.prevVol} text-center text-xs text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          PREV VOL
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.curVol} text-center text-xs text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          VOLUME
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.weight} text-center text-xs text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          WEIGHT
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.reps} text-center text-xs text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          REPS
        </Text>
        <View style={tw`flex-${flexWidths.check} text-center text-xs`}></View>
      </View>

      {/* SETS */}
      {exercise.Sets.map((id, idx) => (
        <WorkoutSetComponent
          key={"set" + id}
          setId={id}
          relativeSetIndex={idx}
        />
      ))}

      {!isLocked && (
        <>
          {/* TOGGLE OFF MENU OVERLAY */}
          {workout.menuSelectedId !== undefined && (
            <TouchableWithoutFeedback onPress={toggleOffMenu}>
              <View style={tw`absolute top-0 right-0 bottom-0 left-0`} />
            </TouchableWithoutFeedback>
          )}

          {/* EXERCISE MENU (ADD SET / DEL SET / SWAP) */}
          {workout.menuSelectedId === exercise.id && (
            <View
              style={tw`absolute flex-row right-10 top-3 bg-front w-40 justify-evenly items-center py-2 rounded-full shadow-md`}
            >
              <TouchableOpacity style={tw`py-[1px]`} onPress={swapExerciseUp}>
                <Feather
                  name="arrow-up"
                  size={25}
                  color={CustomColors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity style={tw`py-[1px]`} onPress={delSetFromEnd}>
                <Feather name="minus" size={25} color={CustomColors.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={tw`py-[1px]`} onPress={deleteExercise}>
                <Feather name="trash" size={22} color={"#ff5c5c"} />
              </TouchableOpacity>

              <TouchableOpacity style={tw`py-[1px]`} onPress={addSetToEnd}>
                <Feather name="plus" size={25} color={CustomColors.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={tw`py-[1px]`} onPress={swapExerciseDown}>
                <Feather
                  name="arrow-down"
                  size={25}
                  color={CustomColors.primary}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}
