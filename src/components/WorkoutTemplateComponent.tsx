import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { StyleSheet, Text } from "react-native";

import { WorkoutTemplate } from "../types/workoutTypes";
import { Link } from "expo-router";

interface props {
  index: number;
}

export default function WorkoutTemplateComponent({ index }: props) {
  const template = useSelector(
    (state: RootState) => state.workoutTemplates[index]
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <Link href={`/${template.workoutId}`}>
      <Text>{template.workoutName}</Text>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
