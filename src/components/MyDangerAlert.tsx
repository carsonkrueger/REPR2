import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import tw from "../util/tailwind";

interface props {
  msg: string;
  onOutOfBoundsClick: () => void;
  dangerCommand: () => void;
  safeCommand: () => void;
  dangerText: string;
  safeText: string;
}

const MyAlert = ({
  msg,
  onOutOfBoundsClick,
  dangerCommand,
  safeCommand,
  dangerText,
  safeText,
}: props) => {
  return (
    <TouchableWithoutFeedback onPress={onOutOfBoundsClick}>
      <View
        style={tw`z-100 absolute top-0 right-0 bottom-0 left-0 justify-center items-center bg-transparent`}
      >
        <TouchableWithoutFeedback>
          <View
            style={tw`rounded-lg justify-around bg-front px-4 py-5 max-h-64 max-w-128 h-[25%] w-[85%] shadow-2xl`}
          >
            <Text
              style={[
                tw`text-dark-gray text-xl text-center`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {msg}
            </Text>

            <View style={tw`flex-row justify-evenly items-center`}>
              <TouchableOpacity
                style={tw`rounded-md px-2 py-1 bg-danger shadow-sm`}
                onPress={dangerCommand}
              >
                <Text
                  style={[
                    tw`text-front text-center text-base`,
                    { fontFamily: "RobotoCondensed" },
                  ]}
                >
                  {dangerText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`bg-front px-2 py-1`}
                onPress={safeCommand}
              >
                <Text
                  style={[
                    tw`text-primary text-center text-base`,
                    { fontFamily: "RobotoCondensed" },
                  ]}
                >
                  {safeText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MyAlert;
