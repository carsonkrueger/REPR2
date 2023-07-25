import { BackHandler } from "react-native";
import SearchBar from "../../src/components/searchBar";
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

  async function searchAction(name: string) {
    return await sqlSelectLikeExercisesByName(name).then(
      (rows: exercisesTableRow[]) => {
        return rows;
      }
    );
  }

  return (
    <SafeAreaView>
      <SearchBar
        placeholderText="Search Exercise"
        useSearchResultContainerOverlay={false}
        allowEmptySearch={true}
        doInitEmptySearch={true}
        searchAction={searchAction}
        renderItem={({ item }) => (
          <ExerciseNameSearchResult
            row={item}
            onPress={onExerciseNamePress}
            key={"ExerciseSearchResult" + item.exercise_id}
          />
        )}
        estimatedItemSize={36}
      />
    </SafeAreaView>
  );
}
