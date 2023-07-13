import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { WorkoutSet } from "../../types/workoutTypes";
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EntityId } from "@reduxjs/toolkit";

import flexWidths from "../../util/exerciseHeaderFlexWidths";
import {
  toggleFinishSet,
  selectSetById,
  setWeight,
  setReps,
} from "../../redux/slices/workoutSlice";
import { cleanNumStr } from "../../util/workoutUtils";
import CustomColors from "../../util/customColors";
import { Profile } from "../../types/profileType";
import { selectProfile } from "../../redux/slices/profileSlice";

interface props {
  setId: EntityId;
  relativeSetIndex: number;
}

export default function WorkoutSetComponent({
  setId,
  relativeSetIndex,
}: props) {
  const workoutSet: WorkoutSet = useSelector((state: RootState) =>
    selectSetById(state, setId)
  );
  const profile: Profile = useSelector((state: RootState) =>
    selectProfile(state)
  );
  const dispatch = useDispatch<AppDispatch>();

  const onWeightChanged = (weight: string | number) => {
    if (typeof weight === "string") weight = cleanNumStr(weight);
    dispatch(setWeight({ setId: setId, weight: Number(weight) }));
  };

  const onRepsChanged = (reps: string | number) => {
    if (typeof reps === "string") reps = cleanNumStr(reps);
    dispatch(setReps({ setId: setId, reps: Number(reps) }));
  };

  const onToggleFinish = () => {
    dispatch(toggleFinishSet({ setId: setId }));
    if (workoutSet.weight === 0 && workoutSet.prevWeight !== 0)
      onWeightChanged(workoutSet.prevWeight);
    if (workoutSet.reps === 0 && workoutSet.prevReps !== 0)
      onRepsChanged(workoutSet.prevReps);
  };

  return (
    <View
      style={[
        tw`px-2 flex-row items-center ${
          workoutSet.isFinished ? "bg-light-green" : ""
        }`,
        { elevation: 0 },
      ]}
    >
      <Text
        style={[
          tw`flex-${flexWidths.set} text-center text-lg ${
            workoutSet.isFinished ? "text-dark-finished-green" : "text-primary"
          }`,
          { fontFamily: "" },
        ]}
      >
        {relativeSetIndex + 1}
      </Text>

      <Text
        style={[
          tw`flex-${flexWidths.prevVol} text-center text-lg ${
            workoutSet.isFinished
              ? "text-dark-finished-green"
              : "text-dark-gray"
          }`,
          { fontFamily: "" },
        ]}
      >
        {workoutSet.prevWeight * workoutSet.prevReps}
      </Text>

      <Text
        style={[
          tw`flex-${flexWidths.curVol} text-center text-lg ${
            workoutSet.isFinished
              ? "text-dark-finished-green"
              : "text-dark-gray"
          }`,
          { fontFamily: "" },
        ]}
      >
        {workoutSet.weight * workoutSet.reps}
      </Text>

      <View style={tw`flex-${flexWidths.weight}`}>
        <TextInput
          style={[
            tw`mx-1 text-center text-lg h-8 ${
              workoutSet.isFinished
                ? "text-dark-finished-green"
                : "text-primary bg-back"
            }  rounded-md`,
            { fontFamily: "" },
          ]}
          keyboardType="number-pad"
          maxLength={3}
          editable={!workoutSet.isFinished}
          placeholder={workoutSet.prevWeight.toString()}
          placeholderTextColor={
            workoutSet.isFinished
              ? CustomColors["dark-finished-green"]
              : CustomColors["light-gray"]
          }
          onChangeText={(weight) => onWeightChanged(weight)}
          multiline={profile.isIos ? false : true}
          numberOfLines={1}
        >
          {workoutSet.weight === 0 ? "" : workoutSet.weight}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.reps}`}>
        <TextInput
          style={[
            tw`mx-1 text-center text-lg rounded-md h-8 ${
              workoutSet.isFinished
                ? "text-dark-finished-green"
                : "text-primary bg-back"
            } `,
            { fontFamily: "" },
          ]}
          keyboardType="number-pad"
          maxLength={3}
          editable={!workoutSet.isFinished}
          placeholder={workoutSet.prevReps.toString()}
          placeholderTextColor={
            workoutSet.isFinished
              ? CustomColors["dark-finished-green"]
              : CustomColors["light-gray"]
          }
          onChangeText={(reps) => onRepsChanged(reps)}
          multiline={profile.isIos ? false : true}
          numberOfLines={1}
        >
          {workoutSet.reps === 0 ? "" : workoutSet.reps}
        </TextInput>
      </View>

      <View style={tw`flex-${flexWidths.check} justify-center items-center`}>
        <TouchableOpacity onPress={onToggleFinish}>
          <Ionicons
            name="checkbox"
            color={`${workoutSet.isFinished ? "#a2e8bb" : "#3b83f5"}`}
            size={38}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
