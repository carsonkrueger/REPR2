import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectWorkoutMetricById } from "../../redux/slices/metricsSlice";
import { View, Text } from "react-native";
import tw from "../../util/tailwind";
import { EntityId } from "@reduxjs/toolkit";
import { convertDateToHuman } from "../../util/dates";
import { ExerciseMetric } from "./exerciseMetric";
import { EvilIcons, AntDesign } from "@expo/vector-icons";
import CustomColors from "../../util/customColors";
import { ScrollView } from "react-native-gesture-handler";

interface props {
  workoutMetricId: EntityId;
}

export function WorkoutMetric({ workoutMetricId }: props) {
  const workoutMetric = useSelector((state: RootState) =>
    selectWorkoutMetricById(state, workoutMetricId)
  );

  return (
    <View
      style={tw`bg-front shadow-md rounded-xl p-2 my-4 mx-2 min-h-48 max-h-48 w-55`}
    >
      {/* Header */}
      <View style={tw`flex-col`}>
        {/* Name and date */}
        <View style={tw`pt-1 pb-2 flex-row justify-between items-center`}>
          <Text
            style={[
              tw`text-lg text-primary`,
              { fontFamily: "RobotoCondensed" },
            ]}
          >
            {workoutMetric?.workoutName}
          </Text>
          <Text style={[tw`text-dark-gray`, { fontFamily: "RobotoCondensed" }]}>
            {convertDateToHuman(workoutMetric!.performed, false)}
          </Text>
        </View>
        {/* Time & PR's*/}
        <View style={tw`flex-row items-center`}>
          {/* PR's */}
          <View style={tw`flex-row`}>
            <EvilIcons
              name="trophy"
              size={25}
              color={CustomColors["dark-gray"]}
            />
            <Text
              style={[tw`text-dark-gray`, { fontFamily: "RobotoCondensed" }]}
            >
              {workoutMetric?.numPrs} PRs
            </Text>
          </View>
          {/* Time */}
          <View style={tw`pl-3 flex-row`}>
            <AntDesign
              name="clockcircleo"
              size={19}
              color={CustomColors["dark-gray"]}
            />
            <Text
              style={[
                tw`text-dark-gray pl-1`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {Number(workoutMetric?.workoutTime) / 1000}
            </Text>
          </View>
        </View>
      </View>

      {/* Divider line */}
      <View style={tw`border-b-[1px] border-gray-200 my-1`} />

      {/* Exercises */}
      <View style={tw`flex-row justify-between`}>
        <Text style={[tw`text-dark-gray`, { fontFamily: "RobotoCondensed" }]}>
          Exercise
        </Text>

        <Text style={[tw`text-dark-gray`, { fontFamily: "RobotoCondensed" }]}>
          Best Set
        </Text>
      </View>

      <ScrollView style={tw`px-1`}>
        {workoutMetric?.exerciseIds.map((id) => (
          <ExerciseMetric exerciseMetricId={id} key={"ExerciseMetric" + id} />
        ))}
      </ScrollView>
    </View>
  );
}
