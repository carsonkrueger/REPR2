import { View, Text } from "react-native";
import { exercisesTableRow } from "../../types/localDBTables";

interface props {
  row: exercisesTableRow;
}

export default function ExerciseSearchResult({ row }: props) {
  return (
    <View>
      <Text>{row.exercise_name}</Text>
    </View>
  );
}
