import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectWorkoutMetricById } from "../../redux/slices/metricsSlice";
import { View, Text } from "react-native";
import tw from "../../util/tailwind";
import { EntityId } from "@reduxjs/toolkit";

interface props {
  workoutMetricId: EntityId;
}

export function WorkoutMetric({ workoutMetricId }: props) {
  const workoutMetric = useSelector((state: RootState) =>
    selectWorkoutMetricById(state, workoutMetricId)
  );

  return (
    <View style={tw``}>
      <Text>{workoutMetric?.workoutName}</Text>
    </View>
  );
}
