import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../src/redux/store";
import { Text } from "react-native";

import WorkoutTemplateComponent from "../src/components/WorkoutTemplateComponent";

export default function Workouts() {
  const templates = useSelector((state: RootState) => state.workoutTemplates);
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      {templates.map((_, idx) => (
        <WorkoutTemplateComponent key={idx} index={idx} />
      ))}
    </>
  );
}
