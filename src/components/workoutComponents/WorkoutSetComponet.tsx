import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { WorkoutSet } from "../../types/workoutTypes";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import Ionicons from "@expo/vector-icons/Ionicons";

import { flexWidths } from "./miscWorkoutStyles";
import {
  toggleFinishSet,
  setWeight,
  setReps,
  selectSetByIndex,
} from "../../redux/slices/workoutSlice";

interface props {
  exerciseIndex: number;
  setIndex: number;
}

export default function WorkoutSetComponent({
  exerciseIndex,
  setIndex,
}: props) {
  const workoutSet: WorkoutSet = useSelector((state: RootState) =>
    selectSetByIndex(state, exerciseIndex, setIndex)
  );
  const dispatch = useDispatch<AppDispatch>();

  const onWeightChanged = (weight: string | number) => {
    if (typeof weight === "string") weight = weight.replace(/[^0-9]/g, "");
    dispatch(setWeight([exerciseIndex, setIndex, Number(weight)]));
  };

  const onRepsChanged = (reps: string | number) => {
    if (typeof reps === "string") reps = reps.replace(/[^0-9]/g, "");
    dispatch(setReps([exerciseIndex, setIndex, Number(reps)]));
  };

  const onToggleFinish = () => {
    dispatch(toggleFinishSet([exerciseIndex, setIndex]));
    if (workoutSet.weight === 0 && workoutSet.prevWeight !== 0)
      onWeightChanged(workoutSet.prevWeight);
    if (workoutSet.reps === 0 && workoutSet.prevReps !== 0)
      onRepsChanged(workoutSet.prevReps);
  };

  return (
    <View
      style={tw`px-2 flex-row items-center ${
        workoutSet.isFinished ? "bg-light-green" : ""
      }`}
    >
      <Text
        style={tw`flex-${flexWidths.set} text-center ${
          workoutSet.isFinished ? "text-dark-finished-green" : "text-primary"
        }`}
      >
        {setIndex + 1}
      </Text>

      <Text
        style={tw`flex-${flexWidths.prevVol} text-center ${
          workoutSet.isFinished ? "text-dark-finished-green" : "text-primary"
        }`}
      >
        {workoutSet.prevWeight * workoutSet.prevReps}
      </Text>

      <Text
        style={tw`flex-${flexWidths.curVol} text-center ${
          workoutSet.isFinished ? "text-dark-finished-green" : "text-primary"
        }`}
      >
        {workoutSet.weight * workoutSet.reps}
      </Text>

      <View style={tw`flex-${flexWidths.weight}`}>
        <TextInput
          style={tw`mx-1 text-center ${
            workoutSet.isFinished ? "text-black" : "bg-back"
          }  rounded-md`}
          keyboardType="number-pad"
          maxLength={4}
          editable={!workoutSet.isFinished}
          placeholder={workoutSet.prevWeight.toString()}
          placeholderTextColor={"#d7d9db"}
          onChangeText={(weight) => onWeightChanged(weight)}
          multiline={true}
          numberOfLines={1}
        >
          {workoutSet.weight === 0 ? "" : workoutSet.weight}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.reps}`}>
        <TextInput
          style={tw`mx-1 text-center rounded-md ${
            workoutSet.isFinished ? "text-black" : "bg-back"
          } `}
          keyboardType="number-pad"
          maxLength={4}
          editable={!workoutSet.isFinished}
          placeholder={workoutSet.prevReps.toString()}
          placeholderTextColor={"#d7d9db"}
          onChangeText={(reps) => onRepsChanged(reps)}
          multiline={true}
          numberOfLines={1}
        >
          {workoutSet.reps === 0 ? "" : workoutSet.reps}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.check} justify-center items-center`}>
        <TouchableOpacity onPress={onToggleFinish}>
          <Ionicons
            name="checkbox"
            color={`${workoutSet.isFinished ? "#a2e8bb" : "#60a5fa"}`}
            size={34}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
