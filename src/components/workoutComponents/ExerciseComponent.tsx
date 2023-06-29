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

import tw from "../../util/tailwind";
import { Exercise } from "../../types/workoutTypes";
import { AppDispatch, RootState } from "../../redux/store";
import WorkoutSetComponent from "./WorkoutSetComponet";
import { flexWidths } from "./miscWorkoutStyles";
import {
  addSet,
  delSet,
  selectExerciseByIndex,
  selectIsLocked,
  setExerciseName,
  swapExerciseWithBelow,
} from "../../redux/slices/workoutSlice";
import Clock from "./ClockComponent";

interface props {
  exerciseIndex: number;
}

export default function ExerciseComponent({ exerciseIndex }: props) {
  const isLocked: boolean = useSelector((state: RootState) =>
    selectIsLocked(state)
  );
  const exercise: Exercise = useSelector((state: RootState) =>
    selectExerciseByIndex(state, exerciseIndex)
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const toggleIsSelected = () => {
    setIsSelected((prev) => !prev);
  };

  return (
    <View style={tw`py-3 mt-4 mx-2 bg-front rounded-lg shadow-sm z-0`}>
      {/* HEADER */}
      <View
        style={tw`mx-2 mb-1 flex-row justify-between items-center ${
          isLocked ? "" : "mr-9"
        }`}
      >
        {/* EXERCISE NAME */}
        <TextInput
          style={[
            tw`flex-1 mr-2 text-base text-primary rounded-md px-1 ${
              isLocked ? "" : "bg-back"
            }`,
            { fontFamily: "RobotoCondensed" },
          ]}
          placeholder="Exercise Name"
          placeholderTextColor={"#c2c2c2"}
          onChangeText={(name) =>
            dispatch(setExerciseName([exerciseIndex, name]))
          }
          editable={!isLocked}
          multiline={true}
          numberOfLines={2}
        >
          {exercise.name}
        </TextInput>

        <Clock exerciseIndex={exerciseIndex} />
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
      {exercise.Sets.map((_, idx) => (
        <WorkoutSetComponent
          key={idx}
          exerciseIndex={exerciseIndex}
          setIndex={idx}
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
              <Feather name="more-vertical" size={24} color={"#60a5fa"} />
            </TouchableOpacity>

            {isSelected && (
              <View
                style={[
                  tw`absolute flex-row right-0 mr-7 bg-front w-40 justify-evenly items-center py-2 rounded-full shadow-md z-50`,
                  { zIndex: 10 },
                ]}
              >
                <TouchableOpacity
                  style={tw`py-[1px]`}
                  onPress={() => {
                    dispatch(swapExerciseWithBelow(exerciseIndex - 1));
                    setIsSelected(false);
                  }}
                >
                  <Feather name="arrow-up" size={25} color={"#60a5fa"} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`py-[1px]`}
                  onPress={() => dispatch(delSet(exerciseIndex))}
                >
                  <Feather name="minus" size={25} color={"#60a5fa"} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`py-[1px]`}
                  onPress={() => dispatch(addSet(exerciseIndex))}
                >
                  <Feather name="plus" size={25} color={"#60a5fa"} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`py-[1px]`}
                  onPress={() => {
                    dispatch(swapExerciseWithBelow(exerciseIndex));
                    setIsSelected(false);
                  }}
                >
                  <Feather name="arrow-down" size={25} color={"#60a5fa"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}
