import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { FlashList } from "@shopify/flash-list";
import { selectMetricsState } from "../../src/redux/slices/metricsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { WorkoutMetric } from "../../src/components/metricsComponents/workoutMetric";
import Search from "../../src/components/searchBar";
import { sqlSelectLikeExercisesByName } from "../../src/sqlite/queries";
import { exercisesTableRow } from "../../src/types/localDBTables";
import ExerciseSearchResult from "../../src/components/metricsComponents/exerciseSearchResult";

export default function Metrics() {
  const metricsState = useSelector((state: RootState) =>
    selectMetricsState(state)
  );

  async function onExerciseSearch(name: string) {
    return await sqlSelectLikeExercisesByName(name).then(
      (rows: exercisesTableRow[]) => {
        return rows.map((row) => <ExerciseSearchResult row={row} />);
      }
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* HEADER */}
      <View style={tw`py-2 bg-front shadow-md`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          HISTORY
        </Text>
      </View>
      {/* WORKOUT HISTORY */}
      <View>
        <Text
          style={[
            tw`text-lg text-primary pl-5 pt-5`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          WORKOUTS
        </Text>
        <FlashList
          estimatedItemSize={250}
          data={metricsState.workoutIds}
          renderItem={({ item }) => (
            <WorkoutMetric
              workoutMetricId={item}
              key={"WorkoutMetric" + item}
            />
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={[
                tw`text-center text-lg text-light-gray pl-5 pt-3`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              NO WORKOUT HISTORY
            </Text>
          }
        />
      </View>

      {/* EXERCISE HISTORY */}
      <Search
        placeholder="Search Exercise"
        searchAndReturnElements={onExerciseSearch}
      />
    </SafeAreaView>
  );
}
