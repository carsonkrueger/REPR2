import { Canvas, Path } from "@shopify/react-native-skia";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectExerciseMetrics } from "../../redux/slices/metricsSlice";
import { curveBasis, line, scaleLinear, scaleTime } from "d3";
import round5 from "../../util/round5";
import { useRef } from "react";
import { ExerciseMetric } from "../../types/metricsTypes";

export default function ExerciseChart() {
  const exercises = useSelector((state: RootState) =>
    selectExerciseMetrics(state)
  );
  const GRAPH_HEIGHT = useRef(100);
  const GRAPH_WIDTH = useRef(100);

  async function createExerciseChart(name: string) {
    const exerciseIds = exercises.ids.filter(
      (id) => exercises.entities[id]?.exerciseName === name
    );
    if (exerciseIds.length <= 0) return;

    const dataPoints = exerciseIds.map((id) => exercises.entities[id]!);
    const allVolumes = dataPoints.map((e) => e!.bestReps * e!.bestWeight);
    const maxVolume = round5(Math.max(...allVolumes));
    const minVolume = round5(Math.min(...allVolumes));

    const curDate = new Date();
    let monthAgo = new Date();
    monthAgo.setMonth(curDate.getMonth() - 1);

    const getYAxis = scaleLinear()
      .domain([0, maxVolume])
      .range([GRAPH_HEIGHT.current, 35]);
    const getXAxis = scaleTime()
      .domain([monthAgo, curDate])
      .range([10, GRAPH_WIDTH.current - 10]);

    const curvedLine = line<ExerciseMetric>()
      .x((dp) => getXAxis(new Date(dp.performed)))
      .y((dp) => getYAxis(dp.bestReps * dp.bestWeight))
      .curve(curveBasis)(dataPoints);
  }

  return (
    <Canvas>
      <Path path={""}></Path>
    </Canvas>
  );
}
