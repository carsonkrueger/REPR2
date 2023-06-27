import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import { Ionicons, Entypo } from "@expo/vector-icons";

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
    <View style={tw`py-3 mt-3 mx-2 bg-white rounded-lg shadow-sm`}>
      {/* HEADER */}
      <View style={tw`mx-2 mb-1 flex-row justify-between `}>
        {/* EXERCISE NAME */}
        <TextInput
          placeholder="Exercise Name"
          style={tw`text-lg rounded-md px-1 ${isLocked ? "" : "bg-back"}`}
          onChangeText={(name) =>
            dispatch(setExerciseName([exerciseIndex, name]))
          }
          editable={!isLocked}
          multiline={true}
          numberOfLines={1}
        >
          {exercise.name}
        </TextInput>

        <Clock exerciseIndex={exerciseIndex} />
      </View>

      {/* SETS HEADER */}
      <View style={tw`px-2 my-1 flex-row justify-center items-center`}>
        <Text
          style={[
            tw`flex-${flexWidths.set} text-center text-xs`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          SET
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.prevVol} text-center text-xs`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          PREV VOL
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.curVol} text-center text-xs`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          VOLUME
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.weight} text-center text-xs`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          WEIGHT
        </Text>
        <Text
          style={[
            tw`flex-${flexWidths.reps} text-center text-xs`,
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
