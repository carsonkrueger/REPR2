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
    replaceNavigateTo("/", 0);
  }

  function navigateSearch() {
    replaceNavigateTo("search", 1);
  }

  function navigateWorkouts() {
    replaceNavigateTo("workouts", 2);
  }

  function navigateStartWorkout() {
    pushNavigateTo(`/workout/${curWorkout.id}`, 2);
  }

  function navigateMetrics() {
    replaceNavigateTo("metrics", 3);
  }

  function navigateProfile() {
    replaceNavigateTo("profile", 4);
  }

  return (
    <SafeAreaView
      style={tw`absolute px-1 flex-row items-center bottom-0 right-0 left-0 bg-dark-front z-50 py-[14px]`}
    >
      <View
        style={tw`absolute left-0 right-0 justify-center items-center pb-10`}
      >
        <View style={tw`bg-front rounded-full overflow-hidden`}>
          <TouchableOpacity
            style={tw`p-3 justify-center items-center bg-primary`}
            onPress={
              curWorkout.inProgress ? navigateStartWorkout : navigateWorkouts
            }
          >
            <Ionicons name="barbell-sharp" color={"#fff"} size={27} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateHome}
      >
        <Ionicons
          name={`${selectedPos === 0 ? "home" : "home-outline"}`}
          color={"#3b83f5"}
          size={27}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateSearch}
      >
        <Ionicons
          name={`${selectedPos === 1 ? "search" : "search-outline"}`}
          color={"#3b83f5"}
          size={27}
        />
      </TouchableOpacity>

      <View style={tw`flex-0.8`}></View>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateMetrics}
      >
        <Ionicons
          name={`${selectedPos === 3 ? "stats-chart" : "stats-chart-outline"}`}
          color={"#3b83f5"}
          size={27}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`flex-1 justify-center items-center`}
        onPress={navigateProfile}
      >
        <Ionicons
          name={`${selectedPos === 4 ? "person" : "person-outline"}`}
          color={"#3b83f5"}
          size={27}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
