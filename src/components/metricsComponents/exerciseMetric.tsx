import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectExerciseMetricById } from "../../redux/slices/metricsSlice";
import { View, Text } from "react-native";
import tw from "../../util/tailwind";
import { EntityId } from "@reduxjs/toolkit";

interface props {
  exerciseMetricId: EntityId;
}

export function ExerciseMetric({ exerciseMetricId }: props) {
  const exerciseMetric = useSelector((state: RootState) =>
    selectExerciseMetricById(state, exerciseMetricId)
  );

  return (
    <View style={tw`flex-row justify-between`}>
      <Text
        style={[tw`text-light-gray text-xs`, { fontFamily: "RobotoCondensed" }]}
      >
        {exerciseMetric?.numSets} x {exerciseMetric?.exerciseName}
      </Text>
      <Text
        style={[tw`text-light-gray text-xs`, { fontFamily: "RobotoCondensed" }]}
      >
        {exerciseMetric?.bestWeight} x {exerciseMetric?.bestReps}
      </Text>
    </View>
  );
}
