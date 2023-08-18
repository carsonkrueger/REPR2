import { Text, TouchableOpacity } from "react-native";
import tw from "../../util/tailwind";
import React from "react";

interface props {
  exerciseName: string;
  onPress: (name: string) => void;
}

const ExerciseNameSearchResult = React.memo(
  ({ exerciseName, onPress }: props) => {
    function onPressTouchable() {
      onPress(exerciseName);
    }

    return (
      <TouchableOpacity style={tw`px-4 py-1`} onPress={onPressTouchable}>
        <Text
          style={[
            tw`text-lg text-dark-gray`,
            { fontFamily: "RobotoCondensed" },
          ]}
        >
          {exerciseName}
        </Text>
      </TouchableOpacity>
    );
  }
);

export default ExerciseNameSearchResult;
