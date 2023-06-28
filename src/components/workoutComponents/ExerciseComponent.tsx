import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import { Ionicons } from "@expo/vector-icons";

import { Exercise } from "../../types/workoutTypes";
import WorkoutSetComponent from "./WorkoutSetComponet";
import { flexWidths } from "./miscWorkoutStyles";
import {
  addSet,
  delSet,
  selectExerciseByIndex,
  selectIsLocked,
  setExerciseName,
} from "../../redux/slices/workoutSlice";
import Clock from "./ClockComponent";
import ExerciseMenu from "./exerciseMenu";

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

  return (
    <View style={tw`py-3 mt-3 mx-2 bg-white rounded-lg shadow-sm z-0`}>
      {/* HEADER */}
      <View style={tw`mx-2 mb-1 flex-row justify-between items-center`}>
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

        {!isLocked && <ExerciseMenu exerciseIndex={exerciseIndex} />}
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

      {/* ADD/DEL SET BUTTONS */}
      {!isLocked && (
        <View style={tw`flex-row justify-evenly px-4 pt-2`}>
          <TouchableOpacity onPress={() => dispatch(delSet(exerciseIndex))}>
            <Ionicons name="remove" color={"#60a5fa"} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(addSet(exerciseIndex))}>
            <Ionicons name="add" color={"#60a5fa"} size={25} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
