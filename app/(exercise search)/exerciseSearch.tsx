import { BackHandler, View } from "react-native";
import SearchBar from "../../src/components/searchBar";
import {
  sqlInsertNewExerciseName,
  sqlSelectLikeExercisesByName,
} from "../../src/sqlite/queries";
import { exercisesTableRow } from "../../src/types/localDBTables";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ExerciseNameSearchResult from "../../src/components/workoutComponents/exerciseNameSearchResult";
import { setExerciseName } from "../../src/redux/slices/workoutSlice";
import { TextInput } from "react-native";
import tw from "../../src/util/tailwind";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import CustomColors from "../../src/util/customColors";

const SEARCH_AMOUNT = 15;

export default function ExerciseSearch() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { exerciseId } = useLocalSearchParams();
  const newExerciseName = useRef("");
  const searchOffset = useRef(0);

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

  function onExerciseNamePress(name: string) {
    dispatch(setExerciseName({ id: Number(exerciseId), name: name }));
    navigateBack();
  }

  async function searchAction(name: string) {
    searchOffset.current = SEARCH_AMOUNT;
    return await sqlSelectLikeExercisesByName(name, 0, SEARCH_AMOUNT);
  }

  async function endReachedSearchAction(name: string) {
    return await sqlSelectLikeExercisesByName(
      name,
      searchOffset.current,
      SEARCH_AMOUNT
    ).then((rows: exercisesTableRow[]) => {
      searchOffset.current += SEARCH_AMOUNT;
      return rows;
    });
  }

  function setNewExerciseName(newName: string) {
    newExerciseName.current = newName;
  }

  async function onCreateExercise() {
    if (newExerciseName.current.length <= 1) return;
    sqlInsertNewExerciseName(newExerciseName.current);
    onExerciseNamePress(newExerciseName.current);
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
            exerciseName={item.exercise_name}
            onPress={onExerciseNamePress}
            key={"ExerciseSearchResult" + item.exercise_id}
          />
        )}
        estimatedItemSize={36}
        endReachedSearchAction={endReachedSearchAction}
        onEndReachedThreshold={0.8}
      />

      {/* CREATE NEW EXERCISE */}
      <View
        style={tw`absolute flex-row justify-between items-center bottom-0 left-0 right-0 m-5 bg-primary rounded-lg p-2`}
      >
        <TextInput
          style={[
            tw`flex-1 text-lg bg-back-primary text-white rounded-md px-2 py-1 mr-1`,
            { fontFamily: "RobotoCondensed" },
          ]}
          placeholder="Create Exercise"
          placeholderTextColor={CustomColors.primary}
          onChangeText={setNewExerciseName}
        />
        <TouchableOpacity onPress={onCreateExercise}>
          <Feather
            style={tw``}
            name="plus"
            color={CustomColors["front"]}
            size={30}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
