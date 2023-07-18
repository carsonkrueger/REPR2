import { TextInput, View } from "react-native";
import SearchBar from "../../src/components/SearchBar";
import { sqlSelectLikeExercisesByName } from "../../src/sqlite/queries";
import { exercisesTableRow } from "../../src/types/localDBTables";
import ExerciseSearchResult from "../../src/components/metricsComponents/exerciseSearchResult";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseSearch() {
  async function onExerciseSearch(name: string) {
    return await sqlSelectLikeExercisesByName(name).then(
      (rows: exercisesTableRow[]) => {
        return rows.map((row) => (
          <ExerciseSearchResult
            row={row}
            key={"ExerciseSearchResult" + row.exercise_id}
          />
        ));
      }
    );
  }

  return (
    <SafeAreaView>
      <SearchBar
        placeholderText="Search Exercise"
        searchAndReturnElements={onExerciseSearch}
        useSearchResultContainerOverlay={false}
      />
    </SafeAreaView>
  );
}
