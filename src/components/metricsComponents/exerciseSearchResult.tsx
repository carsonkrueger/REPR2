import { Text, TouchableOpacity } from "react-native";
import { exercisesTableRow } from "../../types/localDBTables";
import tw from "../../util/tailwind";

interface props {
  row: exercisesTableRow;
}

export default function ExerciseSearchResult({ row }: props) {
  return (
    <TouchableOpacity style={tw`px-2 py-[3px]`}>
      <Text
        style={[
          tw`text-base text-dark-gray`,
          { fontFamily: "RobotoCondensed" },
        ]}
      >
        {row.exercise_name}
      </Text>
    </TouchableOpacity>
  );
}
