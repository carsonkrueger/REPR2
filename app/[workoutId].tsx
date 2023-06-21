import { useRouter, useSearchParams } from "expo-router";
import WorkoutComponent from "../src/components/WorkoutComponent";

export default function Workout() {
  const router = useRouter();
  const { workoutId } = useSearchParams();

  return <WorkoutComponent />;
}
