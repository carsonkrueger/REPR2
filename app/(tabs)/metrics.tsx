import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import { FlashList } from "@shopify/flash-list";
import { selectMetricsState } from "../../src/redux/slices/metricsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { WorkoutMetric } from "../../src/components/metricsComponents/workoutMetric";
import Search from "../../src/components/searchBar";
import { sqlSelectLikeExercisesByName } from "../../src/sqlite/queries";
import { exercisesTableRow } from "../../src/types/localDBTables";
import ExerciseNameSearchResult from "../../src/components/workoutComponents/exerciseNameSearchResult";
import { useState } from "react";
import PremiumIcon from "../../src/components/premiumIcon";
import useBackPress from "../../src/hooks/useBackPress";

const SELECT_AMOUNT = 10;

export default function Metrics() {
  useBackPress(false);

  const metricsState = useSelector((state: RootState) =>
    selectMetricsState(state)
  );
  const [isContainerOverlayOpen, setIsContainerOverlayOpen] = useState(false);
  const [exerciseOffset, setExerciseOffset] = useState(0);

  async function searchAction(name: string) {
    setIsContainerOverlayOpen(true);
    return await sqlSelectLikeExercisesByName(
      name,
      exerciseOffset,
      SELECT_AMOUNT
    ).then((rows: exercisesTableRow[]) => {
      setExerciseOffset((prev) => prev + SELECT_AMOUNT);
      return rows;
    });
  }

  function onExerciseNamePress() {
    setIsContainerOverlayOpen(false);
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-front`}>
      {/* HEADER */}
      <View style={tw`flex-row px-3 py-2 justify-between bg-front shadow-md`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          HISTORY
        </Text>
        <PremiumIcon />
      </View>
      {/* WORKOUT HISTORY */}
      <View>
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
        placeholderText="Search Exercise"
        isContainerOverlayOpen={isContainerOverlayOpen}
        searchAction={searchAction}
        renderItem={({ item }) => (
          <ExerciseNameSearchResult
            exerciseName={item}
            onPress={onExerciseNamePress}
            key={"ExerciseSearchResult" + item.exercise_id}
          />
        )}
        estimatedItemSize={36}
      />
    </SafeAreaView>
  );
}
