import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import tw from "../../src/util/tailwind";
import CustomColors from "../../src/util/customColors";
import { FlashList } from "@shopify/flash-list";
import { selectMetricsState } from "../../src/redux/slices/metricsSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import { WorkoutMetric } from "../../src/components/metricsCompoents/workoutMetric";

export default function Metrics() {
  const metricsState = useSelector((state: RootState) =>
    selectMetricsState(state)
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-back`}>
      <View style={tw`py-2 bg-front shadow-md`}>
        <Text
          style={[
            tw`text-xl text-center text-primary`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          METRICS
        </Text>
      </View>

      <View>
        <FlashList
          data={metricsState.workoutIds}
          renderItem={({ item }) => (
            <WorkoutMetric
              workoutMetricId={item}
              key={"WorkoutMetric" + item}
            />
          )}
          horizontal={true}
        />
      </View>
    </SafeAreaView>
  );
}
