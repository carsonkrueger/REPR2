import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectWorkoutMetricById } from "../../redux/slices/metricsSlice";
import { View, Text } from "react-native";
import tw from "../../util/tailwind";
import { EntityId } from "@reduxjs/toolkit";
import { convertDateToHuman } from "../../util/dates";
import { ExerciseMetric } from "./exerciseMetric";
import { useEffect } from "react";

interface props {
  workoutMetricId: EntityId;
}

export function WorkoutMetric({ workoutMetricId }: props) {
  const workoutMetric = useSelector((state: RootState) =>
    selectWorkoutMetricById(state, workoutMetricId)
  );

  return (
    <View
      style={tw`bg-front shadow-md rounded-xl p-2 my-4 mx-2 min-h-36 max-h-44 w-65`}
    >
      <View style={tw`flex-row justify-between items-center`}>
        <Text
          style={[tw`text-lg text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          {workoutMetric?.workoutName}
        </Text>
        <Text
          style={[
            tw`text-md text-light-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {convertDateToHuman(workoutMetric!.performed)}
        </Text>
      </View>

      <View style={tw`border-b-[1px] border-gray-200 my-1`} />

      <View style={tw`flex-row justify-between`}>
        <Text
          style={[
            tw`text-md text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          Exercise
        </Text>

        <Text
          style={[
            tw`text-md text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          Best Set
        </Text>
      </View>

      {workoutMetric?.exerciseIds.map((id) => (
        <ExerciseMetric exerciseMetricId={id} key={"ExerciseMetric" + id} />
      ))}
    </View>
  );
}
