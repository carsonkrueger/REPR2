import { Text, TouchableOpacity } from "react-native";
import { exercisesTableRow } from "../../types/localDBTables";
import tw from "../../util/tailwind";

interface props {
  row: exercisesTableRow;
  onPress: (name: string) => void;
}

export default function ExerciseNameSearchResult({ row, onPress }: props) {
  function onPressTouchable() {
    onPress(row.exercise_name);
  }

  return (
    <TouchableOpacity style={tw`px-4 py-1`} onPress={onPressTouchable}>
      <Text
        style={[tw`text-lg text-dark-gray`, { fontFamily: "RobotoCondensed" }]}
      >
        {row.exercise_name}
      </Text>
    </TouchableOpacity>
  );
}
