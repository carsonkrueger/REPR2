import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

import tw from "../../util/tailwind";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  addSet,
  delSet,
  selectIsLocked,
} from "../../redux/slices/workoutSlice";
import { useDispatch } from "react-redux";

interface props {
  exerciseIndex: number;
}

const ExerciseMenu = ({ exerciseIndex }: props) => {
  const dispatch: AppDispatch = useDispatch();
  const isLocked: boolean = useSelector((state: RootState) =>
    selectIsLocked(state)
  );
  const [isSelected, setIsSelected] = useState(false);

  const toggleIsSelected = () => {
    setIsSelected((prev) => !prev);
  };

  return (
    <View style={tw`h-8 w-6 mx-1 justify-center items-center`}>
      <TouchableOpacity onPress={toggleIsSelected}>
        <Feather name="more-vertical" size={24} color={"#60a5fa"} />
      </TouchableOpacity>

      {isSelected && (
        <View
          style={[
            tw`absolute top-0 mt-8 bg-front w-10 justify-evenly items-center py-2 rounded-full shadow-md`,
            { zIndex: 10 },
          ]}
        >
          <TouchableOpacity style={tw`py-[1px]`}>
            <Feather name="arrow-up" size={25} color={"#60a5fa"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`py-[1px]`}
            onPress={() => dispatch(delSet(exerciseIndex))}
          >
            <Feather name="minus" size={25} color={"#60a5fa"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`py-[1px]`}
            onPress={() => dispatch(addSet(exerciseIndex))}
          >
            <Feather name="plus" size={25} color={"#60a5fa"} />
          </TouchableOpacity>
          <TouchableOpacity style={tw`py-[1px]`}>
            <Feather name="arrow-down" size={25} color={"#60a5fa"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ExerciseMenu;
