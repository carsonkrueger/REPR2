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
    <View style={tw``}>
      <Text>{exerciseMetric?.exerciseName}</Text>
    </View>
  );
}
