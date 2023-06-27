import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import tw from "../util/tailwind";

interface props {
  msg: string;
  closeAlert: () => void;
  dangerCommand: () => void;
  safeCommand: () => void;
  dangerText: string;
  safeText: string;
}

const MyAlert = ({
  msg,
  closeAlert,
  dangerCommand,
  safeCommand,
  dangerText,
  safeText,
}: props) => {
  return (
    <TouchableWithoutFeedback onPress={closeAlert}>
      <View
        style={tw`z-100 absolute top-0 right-0 bottom-0 left-0 bg-transparent justify-center items-center`}
      >
        <TouchableWithoutFeedback>
          <View
            style={tw`rounded-lg justify-between bg-front px-4 py-5 max-h-64 max-w-128 h-[25%] w-[85%]`}
          >
            <Text
              style={[
                tw`text-primary text-lg text-center`,
                { fontFamily: "RobotoCondensed" },
              ]}
            >
              {msg}
            </Text>

            <View style={tw`flex-row justify-evenly items-center`}>
              <TouchableOpacity
                style={tw`rounded-md px-2 py-1 bg-front shadow-sm`}
                onPress={dangerCommand}
              >
                <Text
                  style={[
                    tw`text-red-400 text-center`,
                    { fontFamily: "RobotoCondensed" },
                  ]}
                >
                  {dangerText}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`rounded-md bg-primary px-2 py-1 shadow-sm`}
                onPress={safeCommand}
              >
                <Text
                  style={[
                    tw`text-white text-center`,
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
