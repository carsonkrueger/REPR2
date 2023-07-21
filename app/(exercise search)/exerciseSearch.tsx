import { BackHandler, TextInput, View } from "react-native";
import SearchBar from "../../src/components/SearchBar";
import { sqlSelectLikeExercisesByName } from "../../src/sqlite/queries";
import { exercisesTableRow } from "../../src/types/localDBTables";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ExerciseNameSearchResult from "../../src/components/workoutComponents/exerciseNameSearchResult";
import { setExerciseName } from "../../src/redux/slices/workoutSlice";

export default function ExerciseSearch() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { exerciseId } = useLocalSearchParams();

  useEffect(() => {
    const backAction = () => {
      navigateBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  function navigateBack() {
    router.back();
  }

  function onExerciseNamePress(newName: string) {
    dispatch(setExerciseName({ id: Number(exerciseId), name: newName }));
    navigateBack();
  }

  async function searchAndReturnElements(name: string) {
    return await sqlSelectLikeExercisesByName(name).then(
      (rows: exercisesTableRow[]) => {
        return rows.map((row) => (
          <ExerciseNameSearchResult
            row={row}
            key={"ExerciseSearchResult" + row.exercise_id}
            onPress={onExerciseNamePress}
          />
        ));
      }
    );
  }

  return (
    <SafeAreaView>
      <SearchBar
        placeholderText="Search Exercise"
        searchAndReturnElements={searchAndReturnElements}
        useSearchResultContainerOverlay={false}
        maxTWHeight={"100%"}
        allowEmptySearch={true}
        doInitEmptySearch={true}
      />
    </SafeAreaView>
  );
}
