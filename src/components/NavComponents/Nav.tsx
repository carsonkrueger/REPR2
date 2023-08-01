import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import { WorkoutState } from "../../types/workoutTypes";
import tw from "../../util/tailwind";
import { selectWorkout } from "../../redux/slices/workoutSlice";
import { SafeAreaView } from "react-native";
import CustomColors from "../../util/customColors";
import { index } from "d3";

export default function Nav() {
  const curWorkout: WorkoutState = useSelector((state: RootState) =>
    selectWorkout(state)
  );
  const router = useRouter();
  const [selectedPos, setSelectedPos] = useState(0);

  const replaceNavigateTo = (href: string, index: number) => {
    if (index === selectedPos) return;
    setSelectedPos(index);
    router.replace(href);
  };

  const pushNavigateTo = (href: string, index: number) => {
    if (index === selectedPos) return;
    setSelectedPos(index);
    router.push({ pathname: href, params: { paramWorkoutId: curWorkout.id } });
  };

  function navigateHome() {
    // replaceNavigateTo("/", 0);
    if (selectedPos == 0) return;
    router.back();
    setSelectedPos(0);
  }

  function navigateSearch() {
    if (selectedPos === 0) pushNavigateTo("search", 1);
    else replaceNavigateTo("search", 1);
  }

  function navigateWorkouts() {
    if (selectedPos === 0) pushNavigateTo("workouts", 2);
    else replaceNavigateTo("workouts", 2);
  }

  function navigateStartWorkout() {
    if (selectedPos === 0) pushNavigateTo(`/workout/${curWorkout.id}`, 2);
    else replaceNavigateTo(`/workout/${curWorkout.id}`, 2);
  }

  function navigateMetrics() {
    if (selectedPos === 0) pushNavigateTo("metrics", 3);
    else replaceNavigateTo("metrics", 3);
  }

  function navigateProfile() {
    if (selectedPos === 0) pushNavigateTo("profile", 4);
    else replaceNavigateTo("profile", 4);
  }

  return (
    <SafeAreaView
      style={tw`absolute px-1 flex-row items-center bottom-2 right-3 left-3 bg-dark-front z-50 py-[14px] rounded-full`}
    >
      {/* Workout screen */}
      <View
        style={tw`absolute left-0 right-0 justify-center items-center pb-8`}
      >
        <View
          style={tw`bg-front rounded-full overflow-hidden border-[1px] ${
            selectedPos === 2
              ? "bg-primary border-primary"
              : "bg-white border-dark-front"
          }`}
        >
          <TouchableOpacity
            style={tw`p-[0.7rem] justify-center items-center`}
            onPress={
              curWorkout.inProgress ? navigateStartWorkout : navigateWorkouts
            }
          >
            <Ionicons
              name="barbell-sharp"
              color={selectedPos === 2 ? "#fff" : CustomColors["dark-front"]}
              size={27}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateHome}
      >
        <Ionicons
          // name={`${selectedPos === 0 ? "home" : "home-outline"}`}
          name="home"
          color={selectedPos === 0 ? "#3b83f5" : "#fff"}
          size={25}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateSearch}
      >
        <Ionicons
          // name={`${selectedPos === 1 ? "search" : "search-outline"}`}
          name="search"
          color={selectedPos === 1 ? "#3b83f5" : "#fff"}
          size={25}
        />
      </TouchableOpacity>

      <View style={tw`flex-0.8`}></View>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateMetrics}
      >
        <Ionicons
          // name={`${selectedPos === 3 ? "stats-chart" : "stats-chart-outline"}`}
          name="stats-chart"
          color={selectedPos === 3 ? "#3b83f5" : "#fff"}
          size={25}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateProfile}
      >
        <Ionicons
          // name={`${selectedPos === 4 ? "person" : "person-outline"}`}
          name="person"
          color={selectedPos === 4 ? "#3b83f5" : "#fff"}
          size={25}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
