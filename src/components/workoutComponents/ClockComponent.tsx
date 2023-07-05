import { TextInput, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import tw from "../../util/tailwind";
import { AppDispatch, RootState } from "../../redux/store";
import {
  selectExerciseById,
  selectIsLocked,
  setInitTimer,
  toggleTimer,
} from "../../redux/slices/workoutSlice";
import { Exercise } from "../../types/workoutTypes";
import { useSelector } from "react-redux";
import { cleanNumStr } from "../../util/workoutUtils";
import { EntityId } from "@reduxjs/toolkit";

interface props {
  exerciseId: EntityId;
}

const Clock = ({ exerciseId }: props) => {
  const isLocked: boolean = useSelector((state: RootState) =>
    selectIsLocked(state)
  );
  const exercise: Exercise = useSelector((state) =>
    selectExerciseById(state, exerciseId)
  );
  const dispatch: AppDispatch = useDispatch();

  const [curTime, setCurTime] = useState(
    exercise.timerStartTime ? exercise.timer - calcTimeDif() : exercise.timer
  );

  useEffect(() => {
    if (exercise.timerStartTime) {
      const interval = setInterval(() => {
        if (curTime <= -999) dispatch(toggleTimer({ exerciseId: exerciseId }));
        setCurTime(exercise.timer - calcTimeDif());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurTime(exercise.timer);
    }
  }, [exercise.timerStartTime]);

  function calcTimeDif() {
    if (exercise.timerStartTime)
      return Math.floor(Date.now() / 1000 - exercise.timerStartTime);
    else throw Error("Cannot calc time for undefined start time");
  }

  const onClockPress = () => {
    dispatch(toggleTimer({ exerciseId: exerciseId }));
  };

  const onClockTextChange = (text: string) => {
    const num = Number(cleanNumStr(text));
    setCurTime(num);
    dispatch(setInitTimer({ id: exerciseId, timer: num }));
  };

  return (
    <TouchableOpacity
      onPress={onClockPress}
      style={tw`shadow-md rounded-3xl py-1 px-2 flex-row items-center h-9 ${
        exercise.timerStartTime ? "bg-primary" : "bg-white"
      }`}
    >
      <Ionicons
        name="time-outline"
        color={`${exercise.timerStartTime ? "#fff" : "#3b83f5"}`}
        size={22}
      />
      <TextInput
        editable={!isLocked && !exercise.timerStartTime}
        style={tw` text-center rounded-lg w-8 h-7 ${
          isLocked || exercise.timerStartTime ? "" : "bg-back"
        }
        ${exercise.timerStartTime ? "text-white" : "text-back-primary"}`}
        value={curTime.toString() === "0" ? "" : curTime.toString()}
        placeholder="0"
        maxLength={4}
        keyboardType="number-pad"
        onChangeText={(text: string) => onClockTextChange(text)}
      />
    </TouchableOpacity>
  );
};

export default Clock;
