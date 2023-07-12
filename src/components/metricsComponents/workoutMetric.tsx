import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectWorkoutMetricById } from "../../redux/slices/metricsSlice";
import { View, Text } from "react-native";
import tw from "../../util/tailwind";
import { EntityId } from "@reduxjs/toolkit";
import { convertDateToHuman } from "../../util/dates";
import { ExerciseMetric } from "./exerciseMetric";

interface props {
  workoutMetricId: EntityId;
}

export function WorkoutMetric({ workoutMetricId }: props) {
  const workoutMetric = useSelector((state: RootState) =>
    selectWorkoutMetricById(state, workoutMetricId)
  );

  return (
    <View style={tw`bg-front shadow-md rounded-xl p-2 my-4 mx-2 h-60 w-60`}>
      <View style={tw`flex-row justify-between`}>
        <Text
          style={[tw`text-lg text-primary`, { fontFamily: "RobotoCondensed" }]}
        >
          {workoutMetric?.workoutName}
        </Text>
        {/* <Text>{convertDateToHuman(workoutMetric!.performed)}</Text> */}
      </View>

      {workoutMetric?.exerciseIds.map((id) => (
        <ExerciseMetric exerciseMetricId={id} key={"ExerciseMetric" + id} />
      ))}
    </View>
  );
}
