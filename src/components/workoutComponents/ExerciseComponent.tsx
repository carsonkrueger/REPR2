import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";
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
  selectWorkout,
  setExerciseName,
  swapExerciseWithAbove,
  swapExerciseWithBelow,
} from "../../redux/slices/workoutSlice";
import Clock from "./ClockComponent";
import CustomColors from "../../util/customColors";

interface props {
  exerciseId: EntityId;
}

export default function ExerciseComponent({ exerciseId }: props) {
  const workout = useSelector((state: RootState) => selectWorkout(state));
  const isLocked: boolean = useSelector((state: RootState) =>
    selectIsLocked(state)
  );
  const exercise: Exercise = useSelector((state: RootState) =>
    selectExerciseById(state, exerciseId)
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const toggleIsSelected = () => {
    setIsSelected((prev) => !prev);
  };

  const swapExerciseUp = () => {
    dispatch(swapExerciseWithAbove({ id: exerciseId }));
    setIsSelected(false);
  };

  const swapExerciseDown = () => {
    dispatch(swapExerciseWithBelow({ id: exerciseId }));
    setIsSelected(false);
  };

  const deleteExercise = () => {
    dispatch(delExercise({ id: exerciseId }));
    setIsSelected(false);
  };

  const addSetToEnd = () => {
    dispatch(addSet({ exerciseId: exerciseId, nextSetId: workout.nextSetId }));
  };

  const delSetFromEnd = () => {
    dispatch(
      delSet({
        exerciseId: exerciseId,
        setId: exercise.Sets[exercise.Sets.length - 1],
        numSets: exercise.Sets.length,
      })
    );
  };

  return (
    <View style={tw`py-3 mt-4 mx-2 bg-front rounded-lg shadow-sm`}>
      {/* HEADER */}
      <View
        style={tw`mx-2 mb-1 flex-row justify-between items-center ${
          isLocked ? "" : "mr-9"
        }`}
      >
        {/* EXERCISE NAME */}
        <TextInput
          style={[
            tw`flex-1 mr-2 text-base text-primary rounded-md px-1 max-h-12 h-9 ${
              isLocked ? "" : "bg-back"
            }`,
            { fontFamily: "RobotoCondensed" },
          ]}
          placeholder="Exercise Name"
          placeholderTextColor={"#c2c2c2"}
          onChangeText={(newName) =>
            dispatch(setExerciseName({ id: exerciseId, name: newName }))
          }
          editable={!isLocked}
          multiline={true}
          numberOfLines={2}
        >
          {exercise?.name}
        </TextInput>

        <Clock exerciseId={exerciseId} />
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

      {/* EXERCISE MENU (ADD SET / DEL SET / SWAP) */}
      {!isLocked && (
        <>
          {isSelected && (
            <TouchableWithoutFeedback onPress={toggleIsSelected}>
              <View style={tw`absolute top-0 right-0 bottom-0 left-0`} />
            </TouchableWithoutFeedback>
          )}
          <View
            style={tw`absolute top-4 right-1 h-8 w-6 mx-1 justify-center items-center z-50`}
          >
            <TouchableOpacity onPress={toggleIsSelected}>
              <Feather
                name="more-vertical"
                size={24}
                color={CustomColors.primary}
              />
            </TouchableOpacity>

            {isSelected && (
              <View
                style={[
                  tw`absolute flex-row right-0 mr-7 bg-front w-40 justify-evenly items-center py-2 rounded-full shadow-md z-50`,
                  { zIndex: 10 },
                ]}
              >
                <TouchableOpacity style={tw`py-[1px]`} onPress={swapExerciseUp}>
                  <Feather
                    name="arrow-up"
                    size={25}
                    color={CustomColors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={tw`py-[1px]`} onPress={delSetFromEnd}>
                  <Feather
                    name="minus"
                    size={25}
                    color={CustomColors.primary}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={tw`py-[1px]`} onPress={deleteExercise}>
                  <Feather name="trash" size={22} color={"#ff5c5c"} />
                </TouchableOpacity>

                <TouchableOpacity style={tw`py-[1px]`} onPress={addSetToEnd}>
                  <Feather name="plus" size={25} color={CustomColors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`py-[1px]`}
                  onPress={swapExerciseDown}
                >
                  <Feather
                    name="arrow-down"
                    size={25}
                    color={CustomColors.primary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}
